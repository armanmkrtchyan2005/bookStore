import fs, { existsSync } from "fs";
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
import { LastData } from "../db/model/lastData.model";
import { parse } from "node-html-parser";

import EPub from "epub";
import { DataType } from "sequelize-typescript";

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

      const { name, authorName, description, restriction, genres } = req.body;

      if (req.userData.role === "USER") {
        return res.status(400).json({
          message: "У вас нет прав добавлять книги",
        });
      }
      const files = req.files as IMulterFiles;
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
          id:
            req.userData.role === "AUTHOR"
              ? req.userData.id
              : req.body.authorId,
        },
      });

      if (!author) {
        return res.status(401).json({
          message: "Пользователь не авторизован",
        });
      }
      try {
        const genre = await Genre.findAll({
          where: {
            id: JSON.parse(genres),
          },
        });
        if (genre.length === 0) {
          return res.status(400).json({
            message: "Нет такого жанра",
          });
        }
      } catch (e) {
        return res.status(400).json({
          message: "Нет такого жанра",
        });
      }

      const bookDir = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        `${author.name.split(" ").join("")}_${author.id}`
      );

      if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir);
      }
      const folder = `${name.split(" ").join("")}`;

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

      const fileBaseLink = `/uploads/${author.name.split(" ").join("")}_${
        author.id
      }/${folder}`;

      const book = new Book({
        name,
        authorName,
        description,
        restriction,
        authorId: author.id,
        img: `${fileBaseLink}/avatar/avatar.${img.originalname.split(".")[1]}`,
      });

      await book.save();

      JSON.parse(genres).forEach(async (genreId: string) => {
        try {
          const bookGenre = new BookGenre({
            bookId: book.id,
            genreId,
          });

          await bookGenre.save();
        } catch (e) {
          fs.rmSync(path.join(bookDir, book.img));
        }
      });

      return res.json({ message: "Книга добавлена" });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ message: "Такая книга у вас уже существует" });
    }
  }

  async addChapter(req: Request, res: Response) {
    try {
      const { bookId, name } = req.body;
      const file = req.file;

      if (req.userData.role === "USER") {
        return res.status(403).json({
          message: "У вас нет прав добавить главу",
        });
      }

      if (!file) {
        return res.status(400).json({
          message: "Вы не отправили файл",
        });
      }

      const book = await Book.findOne({
        include: [Author],
        where: {
          id: bookId,
          authorId:
            req.userData.role === "AUTHOR"
              ? req.userData.id
              : req.body.authorId,
        },
      });
      if (!book) {
        return res.status(400).json({
          message: "Книга не найдена",
        });
      }

      const bookDir = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        `${book.author.name.split(" ").join("")}_${book.author.id}`
      );

      if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir);
      }
      const folder = `${book.name.split(" ").join("")}`;

      const fileBaseLink = `/uploads/${book.author.name.split(" ").join("")}_${
        book.author.id
      }/${folder}`;
      const fileData = fs.readFileSync(file.path, "utf8");
      const date = Date.now();
      if (file.originalname.split(".")[1] === "fb2") {
        const root = parse(fileData, { parseNoneClosedTags: false });

        const text = root.querySelector("body")?.innerText as string;

        fs.writeFileSync(
          path.join(bookDir, folder, "chapter", `chapter${date}.txt`),
          text,
          "utf8"
        );
      } else if (file.originalname.split(".")[1] === "txt") {
        fs.writeFileSync(
          path.join(bookDir, folder, "chapter", `chapter${date}.txt`),
          fileData,
          "utf8"
        );
      } else if (file.originalname.split(".")[1] === "epub") {
        const epub = new EPub(file.path);

        epub.on("end", function () {
          epub.flow.forEach(function (chapter: any) {
            epub.getChapter(chapter.id, function (err, text) {
              const root = parse(fileData);

              const txt = root.innerText as string;
              console.log(txt);

              fs.writeFileSync(
                path.join(bookDir, folder, "chapter", `chapter${date}.txt`),
                txt,
                "utf8"
              );
            });
          });
        });
        epub.parse();
      }
      fs.rmSync(file.path);

      const chapter = new Chapter({
        name,
        dataUrl: `${fileBaseLink}/chapter/chapter${date}.txt`,
        bookId: book.id,
      });

      await chapter.save();

      return res.json(book);
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        message: "Ошибка создания главы",
      });
    }
  }

  async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (req.userData.role === "USER") {
        return res.status(400).json({
          message: "У вас нет прав удалить книгу",
        });
      }

      const book = await Book.findOne({
        where: {
          id,
        },
        include: [Author],
      });

      if (!book) {
        return res.status(400).json({
          message: "Такая книга не существует",
        });
      }

      fs.rmSync(
        path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          `${book.author.name.split(" ").join("")}_${book.author.id}`,
          `${book.name}`
        ),
        { force: true, recursive: true }
      );

      await book.destroy();

      return res.json({
        message: "Книга удалена",
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Книга не удалена",
      });
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
            where: [authors.length !== 0 ? { id: authors } : {}],
          },
          {
            model: Genre,
            through: {
              attributes: [],
            },
            where: {
              value: {
                [Op.iLike]: {
                  [Op.any]: genres,
                },
              },
            },
          },
          {
            model: User,
            where: {
              id: req.userData?.role === "USER" ? req.userData.id : null,
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
                userId: req.userData?.role === "USER" ? req.userData.id : null,
                deviceId:
                  req.userData?.role === "USER" ? null : (deviceId as string),
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
            console.log(error);

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
      const deviceId = req.query?.deviceId;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      let book = await Book.findOne({
        include: [
          { model: Chapter },
          { model: Genre, through: { attributes: [] } },
          Author,
          {
            model: User,
            where: {
              id: req?.userData?.role === "USER" ? req.userData.id : null,
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

      let chapters, lastData;
      if (deviceId) {
        chapters = await Promise.all(
          book.chapters.map(async (chapter) => {
            try {
              const [uChapter] = await UserChapter.findOrCreate({
                where: {
                  userId:
                    req?.userData?.role === "USER" ? req?.userData?.id : null,
                  deviceId: req?.userData?.id ? null : (deviceId as string),
                  chapterId: chapter.id,
                },
              });

              await uChapter.save();

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
        lastData = await LastData.findOne({
          where: {
            userId: req?.userData?.role === "USER" ? req?.userData?.id : null,
            deviceId: req?.userData?.id ? null : (deviceId as string),
            bookId,
          },
        });
      }

      return res.json({
        ...book.toJSON(),
        chapters: chapters || book.chapters,
        lastPage: lastData?.lastPage,
        lastIndex: lastData?.lastIndex,
      });
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Книга не найдена",
      });
    }
  }

  async setChapterPercent(req: Request, res: Response) {
    try {
      const { chapterId, readPercent, deviceId, page, lastIndex } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      const chapter = await Chapter.findOne({
        where: {
          id: chapterId,
        },
      });

      if (!chapter) {
        return res.status(400).json({
          message: "Глава не найдена",
        });
      }

      let percent = await UserChapter.findOne({
        where: {
          userId: req.userData?.role ? req.userData.id : null,
          deviceId: req.userData?.role ? null : (deviceId as string),
          chapterId,
        },
      });

      if (!percent) {
        percent = new UserChapter({
          userId: req.userData?.role ? req.userData.id : null,
          deviceId: req.userData?.role ? null : deviceId,
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

      const [lastData] = await LastData.findOrCreate({
        where: {
          userId: req.userData?.role ? req.userData.id : null,
          deviceId: req.userData?.role ? null : (deviceId as string),
          bookId: chapter.bookId,
        },
      });

      lastData.set({
        lastIndex,
        lastPage: page,
      });

      await lastData.save();

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

  async deleteGenre(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (req.userData.role !== "ADMIN") {
        return res.status(400).json({
          message: "У вас нет прав удалить жанры",
        });
      }

      await Genre.destroy({
        where: {
          id,
        },
      });
      return res.json({
        message: "Удалена",
      });
    } catch (e) {
      res.status(400).json({
        message: "Не удалена",
      });
    }
  }

  async createGenre(req: Request, res: Response) {
    try {
      const { value } = req.body;
      if (req.userData.role !== "ADMIN") {
        return res.status(400).json({
          message: "У вас нет прав добавлять жанры",
        });
      }

      const genre = new Genre({
        value,
      });

      await genre.save();

      return res.json({
        message: "Создана",
      });
    } catch (e) {
      res.status(400).json({
        message: "Не создана",
      });
    }
  }
}

export default new BookController();
