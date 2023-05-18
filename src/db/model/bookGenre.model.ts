import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Book } from "./book.model";
import { Genre } from "./genre.model";

interface IBookGenre {
  id?: string;
  bookId: string;
  genreId: string;
}

@Table({
  timestamps: false,
})
export class BookGenre extends Model<IBookGenre> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Book)
  @Column(DataType.UUID)
  bookId!: string;

  @ForeignKey(() => Genre)
  @Column(DataType.UUID)
  genreId!: string;
}
