import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Author } from "./author.model";

interface IComplain {
  id?: number;
  authorId: number;
  message: string;
}

@Table({
  timestamps: false,
})
export class Complain extends Model<IComplain> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Author)
  @Column
  authorId!: number;

  @BelongsTo(() => Author)
  author!: Author;

  @Column(DataType.TEXT)
  message!: string;
}
