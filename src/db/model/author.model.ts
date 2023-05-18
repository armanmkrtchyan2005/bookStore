import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Book } from "./book.model";
import { User } from "./user.model";
import { UserAuthor } from "./userAuthor.model";

interface IAuthor {
  id?: string;
  name: string;
  surname: string;
  fatherName: string;
  alias: string;
  birthDate: Date | null;
  email: string;
  password: string;
  refAuthorId?: string | null;
  reqCount?: number;
}
@Table({
  defaultScope: {
    attributes: { exclude: ["email", "password"] },
  },
})
export class Author extends Model<IAuthor> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  surname!: string;

  @Column
  fatherName!: string;

  @Column
  alias!: string;

  @Column(DataType.DATE)
  birthDate!: Date | null;

  @AllowNull(false)
  @Unique
  @Column
  email!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @ForeignKey(() => Author)
  @Column(DataType.UUID)
  refAuthorId!: string;

  @Default(0)
  @Column
  reqCount!: number;

  @HasMany(() => Book)
  books!: Book[];

  @BelongsToMany(() => User, () => UserAuthor)
  followers!: User[];
}
