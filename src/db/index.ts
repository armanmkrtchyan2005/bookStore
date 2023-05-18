import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
import { User } from "./model/user.model";
import { Author } from "./model/author.model";
import { Book } from "./model/book.model";
import { Genre } from "./model/genre.model";
import { Chapter } from "./model/chapter.model";
import { BookGenre } from "./model/bookGenre.model";
import { UserChapter } from "./model/userChapter.model";
import { BookLike } from "./model/bookLike.model";
import { UserAuthor } from "./model/userAuthor.model";
import { UserReadNow } from "./model/userReadNow.model";
import { Complain } from "./model/complain.model";
import { Admin } from "./model/admin.model";
import { LastData } from "./model/lastData.model";

config();

export const db = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [
    User,
    Author,
    Book,
    Genre,
    Chapter,
    BookGenre,
    UserChapter,
    BookLike,
    UserAuthor,
    UserReadNow,
    Complain,
    Admin,
    LastData,
  ],
  logging: true,
});
