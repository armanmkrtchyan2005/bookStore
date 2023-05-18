import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../config";
import Button from "../Base/Button/Button";
import Input from "../Base/Input/Input";
import "./forgot.css";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function Forgot() {
  const navigate = useNavigate();
  const [sended, setSended] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSendEmail = async () => {
    try {
      await axios.post(`${baseUrl}/api/v2/password-reset`, {
        email,
        role: "AUTHOR",
      });
      setSended(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckCode = async () => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v2/password-reset/confirm`,
        { code }
      );
      return navigate("/forgot-password/reset", { state: data.link });
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="forgot">
      <h1>Восстановление пароля</h1>
      <div className="reset redirectLink">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type={"text"}
          placeholder={"E-mail"}
        />
        {!sended ? (
          <>
            <p className="grey">
              Для восстановления пароля введите почту, на которую
              зарегистрирован аккаунт. Мы отправим вам проверочный код.
            </p>
            <Button
              disabled={email.match(emailRegex) ? false : true}
              onClick={handleSendEmail}
              value={"Продолжить"}
            />
          </>
        ) : (
          <>
            <Input
              type={"text"}
              value={code.code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder={"Проверочный код"}
            />
            <p className="grey">
              Для восстановления пароля введите почту, на которую
              зарегистрирован аккаунт. Мы отправим вам проверочный код. Код
              действителен 30 минут.
            </p>
            <span onClick={handleSendEmail} className="orange">
              Отправить код повторно
            </span>
            <Button
              // disabled={code.code.length == 6 ? false : true}
              onClick={handleCheckCode}
              value={"Продолжить"}
            />
          </>
        )}
        <div className="route">
          <Link to={"/sign-up"}>Регистрация</Link>
          <Link to={"/login"}>Вход</Link>
        </div>
      </div>
    </div>
  );
}
