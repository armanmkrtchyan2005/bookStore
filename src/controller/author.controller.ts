import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { literal, Op } from "sequelize";
import { Request, Response } from "express";
import { Author } from "../db/model/author.model";
import { Book } from "../db/model/book.model";
import fs from "fs";
import path from "path";
import { Chapter } from "../db/model/chapter.model";
import { Sequelize } from "sequelize-typescript";
import sequelize from "sequelize";

const jwtOption = {};

class AuthorController {
  async registration(req: Request, res: Response) {
    try {
      interface IError {
        name?: string;
        surname?: string;
        fatherName?: string;
        birthDate?: string;
        email?: string;
        password?: string;
      }

      const passwordMinLength = 6;
      const { authorId } = req.query;
      const {
        name,
        surname,
        fatherName,
        alias,
        birthDate,
        email,
        password,
        confirm,
      } = req.body;
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      const error: IError = {};

      if (!name.trim()) {
        error.name = "Напишите ваше имя";
      }

      if (!surname.trim()) {
        error.surname = "Напишите ваше фамилия";
      }

      if (!birthDate.trim()) {
        error.birthDate = "Напишите вашу дату рождения";
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

      let user = await Author.findOne({
        where: {
          email,
        },
      });

      if (user) {
        error.email = "Этот электронный адрес уже используется";
      }

      if (Object.keys(error).length !== 0) {
        return res.status(400).json({
          ...error,
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);

      user = new Author({
        name,
        surname,
        fatherName: fatherName ?? null,
        alias,
        birthDate: new Date(birthDate),
        email,
        password: hashPassword,
      });
      if (authorId) {
        const author = await Author.findOne({
          where: {
            id: Number(authorId),
          },
        });

        if ((author?.reqCount as number) <= 3) {
          user.set({
            refAuthorId: author?.id,
          });

          await author?.update({
            reqCount: author.reqCount + 1,
          });
        }
      }

      await user.save();

      return res.status(201).json({ message: "Вы успешно зарегистрированы!" });
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Ошибка регистрации",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await Author.findOne({
        attributes: {
          include: ["password", "email"],
        },
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Электронная почта или пароль неверны",
        });
      }

      const compPass = bcrypt.compareSync(password, user?.password as string);
      console.log(compPass);

      if (!compPass) {
        return res.status(400).json({
          message: "Электронная почта или пароль неверны",
        });
      }

      const token = jwt.sign(
        { id: user?.id },
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

  async getAuthors(req: Request, res: Response) {
    try {
      const { q, limit = 10 } = req.query;

      const authors = await Author.findAll({
        limit: limit ? +limit : undefined,
        where: {
          [Op.or]: {
            name: {
              [Op.iLike]: `%${q ?? ""}%`,
            },
            surname: {
              [Op.iLike]: `%${q ?? ""}%`,
            },
            alias: {
              [Op.iLike]: `%${q ?? ""}%`,
            },
          },
        },
        include: [
          {
            model: Book,
            required: true,
            attributes: [],
          },
        ],
      });

      return res.json(authors);
    } catch (e) {
      console.log(e);

      return res.status(400).json({
        message: "Ошибка со стороны сервера",
      });
    }
  }

  async getAuthor(req: Request, res: Response) {
    try {
      const { authorId } = req.params;

      const author = await Author.findOne({
        include: [Book],
        where: {
          id: authorId,
        },
      });

      if (!author) {
        return res.status(400).json({
          message: "Нет токово пользователя",
        });
      }

      return res.json(author);
    } catch (e) {
      return res.status(400).json({
        message: "Нет токово пользователя",
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    if (req.userData.id !== Number(id)) {
      return res.status(400).json({
        message: "Вы не имеете право удалить этого пользователя",
      });
    }

    const user = await Author.findOne({
      where: {
        id,
      },
    });

    await user?.destroy();

    fs.rmSync(path.join("uploads", `${user?.name}_${id}`), {
      recursive: true,
      force: true,
    });

    return res.status(204).json(user);
  }

  async referralLink(req: Request, res: Response) {
    const author = await Author.findOne({
      where: {
        id: req.userData.id,
      },
    });

    if ((author?.reqCount as number) > 3) {
      return res.status(400).json({
        message: "Сегодня вы уже использовали вашу ",
      });
    }

    const newDate = new Date();
    if (author?.refAuthorId) {
      if (newDate.getTime() - author?.createdAt.getTime() < 86400000) {
        return res.status(400).json({
          message: "Ссылка будет сгенерирована через 24 часа после регистрации",
        });
      }
    }

    return res.json({
      referralLink: `${process.env.HOST}/sign-up?authorId=${req.userData.id}`,
    });
  }
}

export default new AuthorController();
