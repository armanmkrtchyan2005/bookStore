import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Author } from "../db/model/author.model";
import sendMail from "../sendGmail/gmail";
import { User } from "../db/model/user.model";

const jwtOption = { expiresIn: "1h" };

let confCode: number | null = null;
let userId: string | null = null;

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

class PasswordReset {
  async sendEmail(req: Request, res: Response) {
    try {
      const { email, role } = req.body;

      let user: User | Author | null;

      if (role === "AUTHOR") {
        user = await Author.findOne({
          where: {
            email,
          },
        });

        if (!user) {
          return res.status(400).json({
            message: "Нету такого пользователя",
          });
        }
      } else if (role === "USER") {
        user = await User.findOne({
          where: {
            email,
          },
        });

        if (!user) {
          return res.status(400).json({
            message: "Нету такого пользователя",
          });
        }
      } else {
        return res.status(400).json({
          message: 'Вы должны отправить role либо "AUTHOR" либо "USER" ',
        });
      }

      confCode = generateCode();
      userId = user.id;

      await sendMail({
        from: "Bookva.site<bookvasite@gmail.com>",
        to: email,
        subject: "Code for reset password",
        text: "Code for reset password",
        html: `<b>${confCode}</b>`,
      });

      return res.json({
        message: "Код отправлен в вашу электронную почту",
      });
    } catch (e) {
      console.log(e);
      confCode = null;

      return res.status(400).json({
        message: "Ошибка восстановления пароля",
      });
    }
  }

  async confirmCode(req: Request, res: Response) {
    try {
      const { code } = req.body;

      if (Number(code) !== confCode) {
        return res.status(400).json({
          message: "Код не верный",
        });
      }

      const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET as string,
        jwtOption
      );

      confCode = null;

      return res.json({
        link: `/api/v2/password-reset/${userId}/${token}`,
      });
    } catch (e) {
      console.log(e);
      confCode = null;
      userId = null;
      return res.status(400).json({
        message: "Ошибка восстановления пароля",
      });
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      interface IError {
        password?: string;
      }

      const error: IError = {};

      const passwordMinLength = 6;

      const { token, userId } = req.params;

      const { password, confirm, role } = req.body;

      const parsedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as {
        id: string;
      };

      if (userId !== parsedToken.id) {
        return res.status(400).json({
          message: "Неверный адрес",
        });
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

      if (Object.keys(error).length !== 0) {
        return res.status(400).json({
          ...error,
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);

      if (role === "AUTHOR") {
        const author = await Author.findOne({
          where: {
            id: userId,
          },
        });
        await author?.update({
          password: hashPassword,
        });
        return res.json({
          message: "Ваш пароль успешно изменен",
        });
      } else if (role === "USER") {
        const user = await User.findOne({
          where: {
            id: userId,
          },
        });
        await user?.update({
          password: hashPassword,
        });
        return res.json({
          message: "Ваш пароль успешно изменен",
        });
      }
      return res.status(400).json({
        message: "Вы не прошли предыдущие два этапа",
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Ошибка восстановления пароля",
      });
    }
  }
}

export default new PasswordReset();
