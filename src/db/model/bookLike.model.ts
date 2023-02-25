import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Book } from "./book.model";
import { User } from "./user.model";

interface IBookLike {
  id?: number;
  bookId: number;
  userId: number;
}

@Table({
  timestamps: false,
})
export class BookLike extends Model<IBookLike> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Book)
  @Column
  bookId!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number


}
