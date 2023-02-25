import React, { useState } from "react";
import Button from "../Base/Button/Button";
import Input from "../Base/Input/Input";
import axios from "axios";
import { Link } from "react-router-dom";
import "./signup.css";
import { baseUrl } from "../../config";
import WellDone from "./WellDone/WellDone";

export default function SignUp() {
  const [radio, setRadio] = useState(false);
  const [radioError, setRadioError] = useState(null);
  const [error, setError] = useState({});
  const [wellDone, setWellDone] = useState(false);
  const [data, setData] = useState({
    name: "",
    surname: "",
    fatherName: "",
    alias: "",
    birthDate: "",
    email: "",
    password: "",
    confirm: "",
  });

  if (wellDone) {
    return <WellDone />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!radio) {
      setRadioError("Вы должны согласится на обработку персональных данных");
      return;
    }
    setRadioError(null);

    try {
      const res = await axios.post(
        `${baseUrl}/api/v2/author/registration`,
        data
      );
      setWellDone(true);
    } catch (e) {
      setError(e.response.data);
      console.log(e.response.data);
    }
  };

  return (
    <form className="register" onSubmit={handleSubmit}>
      <h1>Регистрация</h1>
      <Link to={"/login"}>Вход</Link>
      <div>
        <Input
          type={"text"}
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder={"E-mail*"}
        />
        <span>{error.email}</span>

        <Input
          type={"text"}
          value={data.surname}
          onChange={(e) => setData({ ...data, surname: e.target.value })}
          placeholder={"Фамилия*"}
        />
        <span>{error.surname}</span>

        <Input
          type={"text"}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder={"Имя*"}
        />
        <span>{error.name}</span>

        <Input
          type={"text"}
          value={data.fatherName}
          onChange={(e) => setData({ ...data, fatherName: e.target.value })}
          placeholder={"Отчество"}
        />

        <Input
          type={"date"}
          value={data.birthDate}
          onChange={(e) => {
            setData({ ...data, birthDate: e.target.value });
          }}
        />
        <span>{error.birthDate}</span>

        <div className="author">Я автор</div>

        <Input
          type={"text"}
          value={data.alias}
          onChange={(e) => setData({ ...data, alias: e.target.value })}
          placeholder={"Псевдоним"}
        />

        <Input
          type={"password"}
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder={"Придумайте пароль*"}
        />
        <span>{error.password}</span>

        <Input
          type={"password"}
          value={data.confirm}
          onChange={(e) => setData({ ...data, confirm: e.target.value })}
          placeholder={"Повторите пароль*"}
        />
      </div>
      <div className="radio">
        <input
          type="radio"
          className="custom-input"
          id="customCheck1"
          value={radio}
          onChange={() => setRadio(true)}
        />
        <label className="custom-label" htmlFor="customCheck1">
          Согласен на обработку персональных данных
        </label>
      </div>
      {radioError ? <p className="error">{radioError}</p> : null}
      <Button type="submit" value={"Войти"} />
    </form>
  );
}
