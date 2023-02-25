import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Book } from "./book.model";
import { User } from "./user.model";
import { UserChapter } from "./userChapter.model";

interface IChapter {
  id?: number;
  name: string;
  dataUrl: string;
  bookId: number;
}

@Table({
  timestamps: false,
})
export class Chapter extends Model<IChapter> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  dataUrl!: string;

  @AllowNull(false)
  @ForeignKey(() => Book)
  @Column
  bookId!: number;

  @BelongsTo(() => Book)
  book!: Book;
}
