import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Author } from "./author.model";
import { Book } from "./book.model";
import { BookLike } from "./bookLike.model";
import { Chapter } from "./chapter.model";
import { UserAuthor } from "./userAuthor.model";
import { UserChapter } from "./userChapter.model";
import { UserReadNow } from "./userReadNow.model";

interface IUser {
  id?: string;
  email?: string;
  login?: string;
  password?: string;
}

@Table({
  timestamps: false,
  defaultScope: {
    attributes: {
      exclude: ["email", "login", "password"],
    },
  },
})
export class User extends Model<IUser> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Unique
  @Column
  email!: string;

  @AllowNull(false)
  @Unique
  @Column
  login!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @BelongsToMany(() => Chapter, () => UserChapter)
  percent!: Chapter;

  @BelongsToMany(() => Book, () => BookLike)
  likedBooks!: Book[];

  @BelongsToMany(() => Author, () => UserAuthor)
  followings!: Author[];

  @BelongsToMany(() => Book, () => UserReadNow)
  reads!: Book[];
}
