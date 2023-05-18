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
import { Book } from "./book.model";
import { User } from "./user.model";

interface ILastData {
  id?: string;
  userId?: string | null;
  deviceId?: string | null;
  bookId: string;
  lastIndex: number;
  lastPage: number;
}

@Table({
  timestamps: false,
})
export class LastData extends Model<ILastData> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column
  deviceId!: string;

  @ForeignKey(() => Book)
  @Column(DataType.UUID)
  bookId!: string;

  @Default(0)
  @Column
  lastIndex!: number;

  @Default(1)
  @Column
  lastPage!: number;
}
