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
import { User } from "./user.model";

interface IBookLike {
  id?: string;
  bookId: string;
  userId: string;
}

@Table({
  timestamps: false,
})
export class BookLike extends Model<IBookLike> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Book)
  @Column(DataType.UUID)
  bookId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;
}
