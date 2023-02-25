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

interface IUserReadNow {
  id?: number;
  userId?: number | null;
  userIp?: string | null;
  bookId: number;
}

@Table({
  timestamps: false,
})
export class UserReadNow extends Model<IUserReadNow> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @Column
  userIp!: string;

  @ForeignKey(() => Book)
  @Column
  bookId!: number;
}
