import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

interface IGenre {
  id?: string;
  value: string;
}

export const genres: string[] = [
  "Фэнтези",
  "Детективы",
  "Ужасы",
  "Приключения",
  "Поэзия",
  "Фантастика",
  "Любовные романы",
  "Драма",
  "Триллеры",
  "Комиксы и манга",
  "Проза",
  "Бизнес-литература",
  "Психология",
  "Искусство и культура",
  "Научная литература",
  "Хобби и досуг",
  "Изучение языков",
  "Компьютерная литература",
  "История",
  "Общество",
  "Мемуары",
  "Красота и здоровье",
  "Книги для дошкольников",
  "Внеклассное чтение",
  "Детские приключенческие книги",
  "Книги для школьников",
  "Школьные учебники",
  "Детские детективы",
  "Книги для подростков",
];

@Table({
  timestamps: false,
})
export class Genre extends Model<IGenre> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Unique
  @Column
  value!: string;
}
