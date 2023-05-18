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
import { Author } from "./author.model";
import { User } from "./user.model";

interface IUserAuthor {
  id?: string;
  authorId: string;
  userId: string;
}

@Table({
  timestamps: false,
})
export class UserAuthor extends Model<IUserAuthor> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Author)
  @Column(DataType.UUID)
  authorId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;
}
