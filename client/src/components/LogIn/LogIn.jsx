import React, { useContext } from "react";
import Button from "../Base/Button/Button";
import Input from "../Base/Input/Input";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css";
import { useEffect } from "react";
import { baseUrl, siteKey } from "../../config";
import Wrong from "./Wrong/Wrong";
import axios from "axios";
import { TokenContext } from "../../App";
import Captcha from "components/Captcha/Captcha";

export const LogIn = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(TokenContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const onChange = () => {
    setCaptcha(true);
  };

  const onError = () => {
    setCaptcha(false);
  };

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

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/v2/author/login`, {
        email,
        password,
      });
      setToken(data.token);
      localStorage.setItem("token", data.token);

      navigate("/home");
    } catch (e) {
      setIsError(true);
    }
  };
  const setHandleShow = () => {
    setIsError(false);
  };

  return (
    <>
      {isError ? <Wrong setHandleShow={setHandleShow} /> : null}
      <form className="login">
        <h1>Авторизация</h1>
        <div>
          <Input
            type={"text"}
            placeholder={"E-mail"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            type={"password"}
            placeholder={"Пароль"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="radio">
          <input
            type="radio"
            className="custom-input"
            id="customCheck1"
            value={isAgree}
            onChange={() => setIsAgree(true)}
          />
          <label className="custom-label" htmlFor="customCheck1">
            Согласен на обработку персональных данных
          </label>
        </div>
        <Captcha onChange={onChange} onError={onError} />
        <Button value={"Войти"} disabled={isDisabled} onClick={handleLogin} />
        <div className="rout redirectLink">
          <Link to={"/sign-up"}>Регистрация</Link>
          <Link to={"/forgot-password"}>Забыли пароль?</Link>
        </div>
      </form>
    </>
  );
};
