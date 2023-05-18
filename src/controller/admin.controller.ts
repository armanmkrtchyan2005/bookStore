import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Admin } from "../db/model/admin.model";

const jwtOption = {};

class AdminController {
  async registration(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email.trim() && !password.trim()) {
        return res.status(400).json({
          message: "Введите корректные данные",
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);

      const admin = new Admin({
        email,
        password: hashPassword,
      });

      await admin.save();

      const token = jwt.sign(
        { id: admin.id, role: "ADMIN" },
        process.env.JWT_SECRET as string,
        jwtOption
      );

      return res.json({
        token,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Admin error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({
        where: {
          email,
        },
      });

      if (!admin) {
        return res.status(400).json({
          message: "Электронная почта или пароль неверны",
        });
      }

      const compPass = bcrypt.compareSync(password, admin.password as string);

      if (!compPass) {
        return res.status(400).json({
          message: "Электронная почта или пароль неверны",
        });
      }

      const token = jwt.sign(
        { id: admin.id, role: "ADMIN" },
        process.env.JWT_SECRET as string,
        jwtOption
      );

      return res.json({
        token,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Электронная почта или пароль неверны",
      });
    }
  }
}

export default new AdminController();
