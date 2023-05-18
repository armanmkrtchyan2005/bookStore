import React, { useEffect, useRef, useState } from "react";
import Button from "../Base/Button/Button";
import Input from "../Base/Input/Input";
import axios from "axios";
import WellDone from "./WellDone/WellDone";
import Captcha from "components/Captcha/Captcha";
import { Link } from "react-router-dom";
import { baseUrl } from "../../config";
import "./signup.css";

// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// const dateRegex =
//   /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

// const passwordLength = 6;

export default function SignUp() {
  const token = useRef("");
  const [error, setError] = useState({});
  const [wellDone, setWellDone] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
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

  useEffect(() => {
    if (!captcha) {
      setIsDisabled(true);
      return;
    }
    if (!isAgree) {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
  }, [captcha, isAgree]);


  if (wellDone) {
    return <WellDone token={token.current} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${baseUrl}/api/v2/author/registration`,
        data
      );
      setWellDone(true);
      token.current = res.data.token;
    } catch (e) {
      setError(e.response.data);
    }
  };

  const handleCaptchaChange = () => {
    setCaptcha(true);
  };

  const handleCaptchaExpired = (e) => {
    console.log(e);
    setCaptcha(false);
  };

  const handleRadioChange = () => {
    setIsAgree(true);
  };


  return (
    <form className="register" onSubmit={handleSubmit}>
      <h1>Регистрация</h1>
      <Link to={"/login"} className="redirectLink text-center">
        Вход
      </Link>
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

        <div className="author redirectLink">Я автор</div>

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
          value={isAgree}
          onChange={handleRadioChange}
        />
        <label className="custom-label grey" htmlFor="customCheck1">
          Согласен на обработку персональных данных
        </label>
      </div>
      <Captcha
        onChange={handleCaptchaChange}
        onExpired={handleCaptchaExpired}
      />
      <Button disabled={isDisabled} type="submit" value={"Войти"} />
    </form>
  );
}
