import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Chapter } from "./chapter.model";
import { User } from "./user.model";

interface IUserChapter {
  id?: string;
  chapterId: string;
  userId?: string | null;
  deviceId?: string | null;
  readPercent?: number;
  page?: number;
}

@Table({
  timestamps: false,
})
export class UserChapter extends Model<IUserChapter> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Chapter)
  @Column(DataType.UUID)
  chapterId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

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
