import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type Roles = "USER" | "AUTHOR" | "ADMIN";

export interface IReqUser {
  id: string;
  role: Roles;
}

declare global {
  namespace Express {
    interface Request {
      userData: IReqUser;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        message: "Пользователь не авторизован",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);

    req.userData = decodedData as IReqUser;

    next();
  } catch (e) {
    return res.status(403).json({
      message: "Пользователь не авторизован",
    });
  }
}
