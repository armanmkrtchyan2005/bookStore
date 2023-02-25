import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Author } from "../db/model/author.model";
import { Book } from "../db/model/book.model";

interface IReqUser {
  id: number;
}

export async function authAuthorMiddleware(
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
      next();
      return;
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);

    req.userData = decodedData as IReqUser;

    const author = await Author.findOne({
      include: [Book],
      where: {
        id: req.userData.id,
      },
    });

    return res.json(author);
  } catch (e) {
    next();
  }
}
