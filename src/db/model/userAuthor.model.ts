import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Author } from "./author.model";
import { User } from "./user.model";

interface IUserAuthor {
  id?: number;
  authorId: number;
  userId: number;
}

@Table({
  timestamps: false,
})
export class UserAuthor extends Model<IUserAuthor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Author)
  @Column
  authorId!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;

}
