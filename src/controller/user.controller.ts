import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { User } from "../db/model/user.model";
import { UserAuthor } from "../db/model/userAuthor.model";
import { Book } from "../db/model/book.model";
import { BookLike } from "../db/model/bookLike.model";
import { Author } from "../db/model/author.model";
import { Genre } from "../db/model/genre.model";
import { UserReadNow } from "../db/model/userReadNow.model";
import { Complain } from "../db/model/complain.model";
import { IReqUser } from "../middleware/auth.middleware";

const jwtOption = {};

class UserController {
  async registration(req: Request, res: Response) {
    try {
      interface IError {
        login?: string;
        email?: string;
        password?: string;
      }

      const passwordMinLength = 6;

      const { login, email, password, confirm } = req.body;
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      const error: IError = {};

      if (!login.trim()) {
        error.login = "Напишите ваш псевдоним";
      }

      if (!email.match(emailRegex)) {
        error.email = "Напишите правильную электронную почту";
      }

      if (!password.trim()) {
        error.password = "Напишите ваш пароль";
      }

      if (password !== confirm) {
        error.password = "Пароль не подходит";
      }

      if (password.length < passwordMinLength) {
        error.password = `Пароль должен бить не меньше ${passwordMinLength} знаков`;
      }

      let user = await User.findOne({
        where: {
          [Op.or]: {
            email,
            login,
          },
        },
        attributes: ["email", "login"],
      });

      if (user) {
        if (user.email === email)
          error.email = "Этот электронный адрес уже используется";
        if (user.login === login) error.login = "Этот логин уже используется";
      }

      if (Object.keys(error).length !== 0) {
        return res.status(400).json({
          ...error,
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);

      user = new User({
        login,
        email,
        password: hashPassword,
      });

      await user.save();

      const token = jwt.sign(
        { id: user?.id, role: "USER" },
        process.env.JWT_SECRET as string,
        jwtOption
      );

      return res.status(201).json({ token });
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Ошибка регистрации",
      });
    }
  }

  async socSites(req: Request, res: Response) {
    const { login, email, password } = req.body;

    let user = await User.findOne({
      where: {
        [Op.or]: {
          email,
          login,
        },
      },
    });

    if (user) {
      const token = jwt.sign(
        { id: user?.id, role: "USER" },
        process.env.JWT_SECRET as string,
        jwtOption
      );

      return res.json({
        token,
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    user = new User({
      login,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user?.id, role: "USER" },
      process.env.JWT_SECRET as string,
      jwtOption
    );

    return res.json({
      token,
    });
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        attributes: {
          include: ["email", "password"],
        },
        where: {
          [Op.or]: {
            email,
            login: email,
          },
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Электронная почта или пароль неверны",
        });
      }

      const compPass = bcrypt.compareSync(password, user?.password as string);

      if (!compPass) {
        return res.status(400).json({
          message: "Электронная почта или пароль неверны",
        });
      }

      const token = jwt.sign(
        { id: user?.id, role: "USER" },
        process.env.JWT_SECRET as string,
        jwtOption
      );

      return res.status(200).json({
        token,
      });
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Ошибка логина",
      });
    }
  }

  async follow(req: Request, res: Response) {
    try {
      const { authorId } = req.body;

      const author = Author.findOne({
        where: {
          id: authorId,
        },
      });

      if (!author) {
        return res.status(400).json({
          message: "Такой автор не существует",
        });
      }

      const userAuthor = new UserAuthor({
        userId: req.userData.id,
        authorId,
      });

      await userAuthor.save();

      return res.json({
        message: "Подписка прошла успешно",
      });
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Подписаться не удалось",
      });
    }
  }

  async unFollow(req: Request, res: Response) {
    try {
      const { authorId } = req.body;

      const userAuthor = await UserAuthor.destroy({
        where: {
          authorId,
          userId: req.userData.id,
        },
      });
      console.log(userAuthor);
      return res.json({
        message: "Подписка удалена",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Подписка не удалена",
      });
    }
  }

  async followings(req: Request, res: Response) {
    try {
      const { q } = req.query;

      const user = await User.findOne({
        where: {
          id: req.userData.id,
        },
        include: [
          {
            model: Author,
          },
        ],
      });

      return res.json(user?.followings);
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Подписок не наидена",
      });
    }
  }

  async likeBook(req: Request, res: Response) {
    try {
      const { bookId } = req.body;

      const like = new BookLike({
        bookId,
        userId: req.userData.id,
      });

      await like.save();

      return res.json({
        message: "Лайк прошла успешна",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Не получилось лаикнуть",
      });
    }
  }

  async getLikedBooks(req: Request, res: Response) {
    try {
      const user = await User.findOne({
        where: {
          id: req.userData.id,
        },
        include: [
          {
            model: Book,
            as: "likedBooks",
            through: {
              attributes: [],
            },
            include: [
              {
                model: Genre,
                attributes: ["value"],
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      return res.json(user?.likedBooks);
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Не получилось получить лайки",
      });
    }
  }

  async deleteLikedBook(req: Request, res: Response) {
    try {
      const { bookId } = req.body;

      await BookLike.destroy({
        where: {
          userId: req.userData.id,
          bookId,
        },
      });
      return res.json({
        message: "Лайк снят",
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Не получилось снять лайк",
      });
    }
  }

  async addReadBook(req: Request, res: Response) {
    try {
      const { bookId, deviceId } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      const isRead = await UserReadNow.findOne({
        where: {
          bookId,
          userId: req.userData?.id || null,
          userIp: req.userData?.id ? null : deviceId,
        },
      });

      if (isRead) {
        return res.status(400).json({
          message: "Такая книга в вашем списке уже есть",
        });
      }

      const read = new UserReadNow({
        bookId,
        userId: req.userData?.id || null,
        userIp: req.userData?.id ? null : deviceId,
      });

      await read.save();
      return res.json({
        message: "Книга добавлена",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Книга не добавлена",
      });
    }
  }

  async deleteReadBook(req: Request, res: Response) {
    try {
      const { bookId, deviceId } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      await UserReadNow.destroy({
        where: {
          bookId,
          userId: req.userData?.id,
          userIp: req.userData?.id ? null : deviceId,
        },
      });
      return res.json({
        message: "Книга удалена",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Книга не удалена",
      });
    }
  }

  async getReadsBooks(req: Request, res: Response) {
    try {
      const { deviceId } = req.query;
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userData = decodedData as IReqUser;
      }

      if (!req.userData?.id) {
        const reads = (
          await UserReadNow.findAll({
            raw: true,
            attributes: ["bookId"],
            where: {
              userIp: deviceId as string,
              userId: null,
            },
          })
        ).map((read) => read.bookId);

        const books = await Book.findAll({
          include: [
            Author,
            {
              model: Genre,
              through: { attributes: [] },
              attributes: ["value"],
            },
          ],
          where: {
            id: reads,
          },
        });

        return res.json(books);
      }

      const user = await User.findOne({
        where: {
          id: req.userData?.id,
        },
        include: [
          {
            model: Book,
            as: "reads",
            include: [
              Genre,
              Author,
              {
                model: User,
                where: {
                  id: req.userData?.id ?? 0,
                },
                required: false,
              },
            ],
          },
        ],
      });

      return res.json(user?.reads);
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Не получилось получить читаные книги",
      });
    }
  }

  async addComplain(req: Request, res: Response) {
    try {
      const { authorId, message } = req.body;

      const complain = new Complain({
        authorId,
        message,
      });

      await complain.save();
      return res.json({
        message: "Вы пожаловались",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Не удалось пожаловаться",
      });
    }
  }

  async getComplains(req: Request, res: Response) {
    try {
      const complains = await Complain.findAll({
        include: [{ model: Author }],
        where: {},
      });

      return res.json(complains);
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Error",
      });
    }
  }
}

export default new UserController();
