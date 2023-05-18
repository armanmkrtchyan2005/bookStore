import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Author } from "./author.model";

interface IComplain {
  id?: string;
  authorId: string;
  message: string;
}

@Table({
  timestamps: false,
})
export class Complain extends Model<IComplain> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Author)
  @Column(DataType.UUID)
  authorId!: string;

  @BelongsTo(() => Author)
  author!: Author;

  @Column(DataType.TEXT)
  message!: string;
}
