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

interface IUserReadNow {
  id?: string;
  userId?: string | null;
  userIp?: string | null;
  bookId: string;
}

@Table({
  timestamps: false,
})
export class UserReadNow extends Model<IUserReadNow> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column
  userIp!: string;

  @ForeignKey(() => Book)
  @Column(DataType.UUID)
  bookId!: string;
}
