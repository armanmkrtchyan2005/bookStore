import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { literal, Op, Sequelize } from "sequelize";
import { Request, Response } from "express";
import { Author } from "../db/model/author.model";
import { Book } from "../db/model/book.model";
import { Chapter } from "../db/model/chapter.model";
import { BookGenre } from "../db/model/bookGenre.model";
import { Genre } from "../db/model/genre.model";
import { UserChapter } from "../db/model/userChapter.model";
import { User } from "../db/model/user.model";
import { IReqUser } from "../middleware/auth.middleware";
import sequelize from "sequelize";

interface IMulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

class BookController {
  async createBook(req: Request, res: Response) {
    try {
      interface IError {
        name?: string;
        authorName?: string;
      }

      const {
        name,
        authorName,
        description,
        restriction,
        genres,
        chapterNames,
      } = req.body;
      const files = req.files as IMulterFiles;
      const chapters = files.chapters;
      const img = files.img[0];
      const error: IError = {};

      if (!name.trim()) {
        error.name = "Напишите название книги";
      }

      if (!authorName.trim()) {
        error.authorName = "Напишите имя автора";
      }

      if (Object.keys(error).length !== 0) {
        return res.status(400).json({
          ...error,
        });
      }

      const author = await Author.findOne({
        where: {
          id: req.userData.id,
        },
      });

      if (!author) {
        return res.status(401).json({
          message: "Пользователь не авторизован",
        });
      }

      const bookDir = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        `${author.name}_${author.id}`
      );

      if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir);
      }
      const folder = `${authorName.split(" ").join()}_${name
        .split(" ")
        .join()}`;

      fs.mkdirSync(path.join(bookDir, folder));
      fs.mkdirSync(path.join(bookDir, folder, "avatar"));
      fs.mkdirSync(path.join(bookDir, folder, "chapter"));

      const imgData = fs.readFileSync(img.path);

      fs.writeFileSync(
        path.join(
          bookDir,
          folder,
          "avatar",
          `avatar.${img.originalname.split(".")[1]}`
        ),
        imgData
      );

      fs.rmSync(img.path);

      const fileBaseLink = `/uploads/${author.name}_${author.id}/${folder}`;

      const book = new Book({
        name,
        authorName,
        description,
        restriction,
        authorId: author.id,
        img: `${fileBaseLink}/avatar/avatar.${img.originalname.split(".")[1]}`,
      });

      await book.save();

      chapters.forEach(async (item, index) => {
        const itemData = fs.readFileSync(item.path, "utf8");

        const parsedChapterNames = JSON.parse(chapterNames);
        fs.writeFileSync(
          path.join(bookDir, folder, "chapter", `chapter${index + 1}.txt`),
          item.originalname.split(".")[1] === "fb2"
            ? itemData.replace(/<\/?[^>]+>/gi, "")
            : itemData,
          "utf8"
        );
        fs.rmSync(item.path);

        const chapter = new Chapter({
          name: parsedChapterNames[index],
          dataUrl: `${fileBaseLink}/chapter/chapter${index + 1}.txt`,
          bookId: book.id,
        });

        await chapter.save();
      });

      JSON.parse(genres).forEach(async (genreId: number) => {
        const bookGenre = new BookGenre({
          bookId: book.id,
          genreId,
        });

        await bookGenre.save();
      });

      return res.json({ message: "Книга добавлена" });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ message: "Такая книга у вас уже существует" });
    }
  }

  async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const book = await Book.findOne({
        where: {
          id,
        },
        include: [Author],
      });

      if (!book) {
        return res.status(400).json({
          message: "Такая книга не сушествует",
        });
      }

      fs.rmSync(
        path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          `${book.author.name}_${book.author.id}`,
          `${book.author}_${book.name}`
        ),
        { recursive: true, force: true }
      );

      return res.json({
        message: "Книга удалена",
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getBooks(req: Request, res: Response) {
    try {
      const {
        q = "",
        author,
        genre = "[]",
        restriction = "",
        limit = 10,
        skip = 0,
        deviceId,
      } = req.query;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      const genres = (
        "%" +
        JSON.parse(genre as string).join("%|%") +
        "%"
      ).split("|");

      let authors = author
        ? JSON.parse(author as string)
            .join(" ")
            .split(" ")
        : [];

      const books = await Book.findAndCountAll({
        include: [
          {
            model: Author,
            where: [
              sequelize.where(
                sequelize.cast(sequelize.col("author.id"), "VARCHAR"),
                {
                  [Op.like]: {
                    [Op.any]: authors?.length != 0 ? authors : ["%%"],
                  },
                }
              ),
            ],
          },
          {
            model: Genre,
            attributes: ["value"],
            where: {
              value: {
                [Op.iLike]: {
                  [Op.any]: genres,
                },
              },
            },
            through: {
              attributes: [],
            },
          },
          {
            model: User,
            where: {
              id: req.userData?.id ?? 0,
            },
            through: {
              attributes: [],
            },
            required: false,
          },
        ],
        limit: limit ? +limit : undefined,
        offset: +skip,
        distinct: true,
        order: literal("RANDOM()"),
        where: {
          restriction: restriction
            ? JSON.parse(restriction as string)
            : [false, true],
          [Op.or]: {
            name: {
              [Op.iLike]: `%${q ?? ""}%`,
            },
            authorName: {
              [Op.iLike]: `%${q ?? ""}%`,
            },
            description: {
              [Op.iLike]: `%${q ?? ""}%`,
            },
            "$author.name$": {
              [Op.iLike]: `%${q ?? ""}%`,
            },
            "$author.surname$": {
              [Op.iLike]: `%${q ?? ""}%`,
            },
            "$author.alias$": {
              [Op.iLike]: `%${q ?? ""}%`,
            },
          },
        },
      });

      const cBooks = await Promise.all(
        books.rows.map(async (book) => {
          try {
            const chapters = await Chapter.findAll({
              where: {
                bookId: book.id,
              },
            });

            const chaptersId = chapters.map((item) => {
              return item.id;
            });

            const percents = await UserChapter.findAll({
              attributes: ["readPercent"],
              where: {
                userId: req.userData?.id ?? null,
                deviceId: req.userData?.id ? null : (deviceId as string),
                chapterId: chaptersId,
              },
            });

            let sum = 0;

            percents.forEach((p) => {
              console.log(p.readPercent);
              sum += p.readPercent;
            });

            const percent = sum / percents.length;

            return { ...book.toJSON(), percent };
          } catch (error) {
            return book;
          }
        })
      );

      return res.json({
        ...books,
        rows: cBooks,
        skip,
      });
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Книги не найдены",
      });
    }
  }

  async getBook(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const { deviceId } = req.query;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      let book = await Book.findOne({
        include: [
          { model: Chapter },
          { model: Genre, attributes: ["value"], through: { attributes: [] } },
          Author,
          {
            model: User,
            where: {
              id: req.userData?.id ?? 0,
            },
            required: false,
          },
        ],
        where: {
          id: bookId,
        },
      });

      if (!book) {
        return res.status(400).json({
          message: "Книга не найдена",
        });
      }

      let lastPage = 0;
      let lastIndex = 0;

      const chapters = await Promise.all(
        book.chapters.map(async (chapter, index) => {
          try {
            const [uChapter] = await UserChapter.findOrCreate({
              where: {
                userId: req.userData?.id ?? null,
                deviceId: req.userData?.id ? null : (deviceId as string),
                chapterId: chapter.id,
              },
            });

            await uChapter.save();

            if (uChapter.readPercent > 0) {
              lastPage = uChapter.page;
              lastIndex = index;
            }

            return {
              ...chapter.toJSON(),
              percent: uChapter.readPercent,
              page: uChapter.page,
            };
          } catch (error) {
            console.dir(error);

            return chapter;
          }
        })
      );

      return res.json({ ...book.toJSON(), chapters, lastPage, lastIndex });
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Книга не найдена",
      });
    }
  }

  async setChapterPercent(req: Request, res: Response) {
    try {
      const { chapterId, readPercent, deviceId, page } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      let percent = await UserChapter.findOne({
        where: {
          userId: req.userData?.id ?? null,
          deviceId: req.userData?.id ? null : (deviceId as string),
          chapterId,
        },
      });

      if (!percent) {
        percent = new UserChapter({
          userId: req.userData?.id ?? null,
          deviceId: req.userData?.id ? null : deviceId,
          chapterId,
        });
      }
      if (readPercent > percent.readPercent) {
        percent.set({
          readPercent,
          page,
        });
      }
      await percent.save();
      return res.json({
        message: "Процент обновлен",
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Процент не обновлен",
      });
    }
  }

  async getChaptersPercents(req: Request, res: Response) {
    try {
      const { bookId, deviceId } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      const chapters = await Chapter.findAll({
        where: {
          bookId,
        },
      });

      const chaptersId = chapters.map((item) => {
        return item.id;
      });

      const percents = await UserChapter.findAll({
        attributes: ["readPercent", "page"],
        where: {
          userId: req.userData?.id ?? null,
          deviceId: req.userData?.id ? null : deviceId,
          chapterId: chaptersId,
        },
        order: [["chapterId", "ASC"]],
      });

      return res.json(percents);
    } catch (e) {
      return res.status(400).json({
        message: "Проценты не взяты",
      });
    }
  }

  async setShowedCount(req: Request, res: Response) {
    try {
      const { bookId } = req.body;
      const book = await Book.findOne({
        where: {
          id: bookId,
        },
      });
      await book?.update({
        showCount: book.showCount++,
      });
      return res.json({
        message: "Количество просмотров обновлен",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Количество просмотров не обновлен",
      });
    }
  }

  async getGenres(req: Request, res: Response) {
    try {
      const { q = "" } = req.query;
      const genres = await Genre.findAll({
        where: {
          value: {
            [Op.iLike]: `%${q}%`,
          },
        },
      });
      return res.json(genres);
    } catch (e) {
      return res.status(200).json({
        message: "Жанры не найдены",
      });
    }
  }
}

export default new BookController();
