import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Book } from "./book.model";
import { BookGenre } from "./bookGenre.model";

interface IGenre {
  id?: number;
  value: string;
}

export const genres: string[] = [
  "Фэнтези",
  "Детективы",
  "Ужасы",
  "Приключения",
  "Поэзия",
  "Фантастика",
  "Любовные романы",
  "Драма",
  "Триллеры",
  "Комиксы и манга",
  "Проза",
  "Бизнес-литература",
  "Психология",
  "Искусство и культура",
  "Научная литература",
  "Хобби и досуг",
  "Изучение языков",
  "Компьютерная литература",
  "История",
  "Общество",
  "Мемуары",
  "Красота и здоровье",
  "Книги для дошкольников",
  "Внеклассное чтение",
  "Детские приключенческие книги",
  "Книги для школьников",
  "Школьные учебники",
  "Детские детективы",
  "Книги для подростков",
];

@Table({
  timestamps: false,
})
export class Genre extends Model<IGenre> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Unique
  @Column
  value!: string;

  @BelongsToMany(() => Book, () => BookGenre)
  books!: Book[];
}
