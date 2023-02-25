import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Book } from "./book.model";
import { Genre } from "./genre.model";

interface IBookGenre {
  id?: number;
  bookId: number;
  genreId: number;
}

@Table({
  timestamps: false,
})
export class BookGenre extends Model<IBookGenre> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Book)
  @Column
  bookId!: number;

  @ForeignKey(() => Genre)
  @Column
  genreId!: number;

}
