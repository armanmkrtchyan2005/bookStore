import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Author } from "./author.model";
import { BookGenre } from "./bookGenre.model";
import { BookLike } from "./bookLike.model";
import { Chapter } from "./chapter.model";
import { Genre } from "./genre.model";
import { User } from "./user.model";

interface IBook {
  id?: string;
  name: string;
  authorName: string;
  description: string;
  img: string;
  restriction: boolean;
  authorId: string;
  showCount?: number;
}

@Table({})
export class Book extends Model<IBook> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  authorName!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @AllowNull(false)
  @Column
  img!: string;

  @AllowNull(false)
  @Column
  restriction!: boolean;

  @Default(0)
  @Column
  showCount!: number;

  @ForeignKey(() => Author)
  @Column(DataType.UUID)
  authorId!: string;

  @BelongsTo(() => Author)
  author!: Author;

  @HasMany(() => Chapter)
  chapters!: Chapter[];

  @BelongsToMany(() => Genre, () => BookGenre)
  genres!: Genre[];

  @BelongsToMany(() => User, () => BookLike)
  usersLiked!: User[];
}
