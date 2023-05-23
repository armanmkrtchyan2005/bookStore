import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Author } from "./author.model";

interface ICompany {
  id?: string;
  name: string;
  content: string;
  startDate: Date;
  clicks?: number;
  url: string;
  maxShowCount: number;
  showCount?: number;
  authorId: string;
}

@Table({})
export class Company extends Model<ICompany> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  content!: string;

  @AllowNull(false)
  @Column
  startDate!: Date;

  @Default(0)
  @Column
  clicks!: number;

  @AllowNull(false)
  @Column
  url!: string;

  @AllowNull(false)
  @Column
  maxShowCount!: number;

  @Default(0)
  @Column
  showCount!: number;

  @ForeignKey(() => Author)
  @Column(DataType.UUID)
  authorId!: string;
}
