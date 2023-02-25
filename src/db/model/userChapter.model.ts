import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Chapter } from "./chapter.model";
import { User } from "./user.model";

interface IUserChapter {
  id?: number;
  chapterId: number;
  userId?: number | null;
  deviceId?: string | null;
  readPercent?: number;
  page?: number;
}

@Table({
  timestamps: false,
})
export class UserChapter extends Model<IUserChapter> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Chapter)
  @Column
  chapterId!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @Column
  deviceId!: string;

  @Default(0)
  @AllowNull(false)
  @Column
  readPercent!: number;

  @Default(1)
  @Column
  page!: number;
}
