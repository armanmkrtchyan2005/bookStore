import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Book } from "./book.model";

interface IChapter {
  id?: string;
  name: string;
  dataUrl: string;
  bookId: string;
}

@Table({
  timestamps: false,
})
export class Chapter extends Model<IChapter> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  dataUrl!: string;

  @AllowNull(false)
  @ForeignKey(() => Book)
  @Column(DataType.UUID)
  bookId!: string;

  @BelongsTo(() => Book)
  book!: Book;
}
