import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../Base/Button/Button";
import Input from "../../Base/Input/Input";

export default function Reset() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  console.log(location.state);
  const handleChangePassword = async () => {
    try {
      const { data } = await axios.put(location.state, {
        password,
        confirm,
        role: "AUTHOR",
      });
      navigate("/login");
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="forgot">
      <h1>Восстановление пароля</h1>
      <div className="reset redirectLink">
        <Input
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Придумайте пароль"}
        />
        <Input
          type={"password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={"Повторите пароль"}
        />
        <p className="grey">
          Придумайте новый пароль, минимальное количество символов - 6
        </p>
        <Button
          disabled={false}
          value={"Сменить пароль"}
          onClick={handleChangePassword}
        />
        <div className="route">
          <Link to={"/sign-up"}>Регистрация</Link>
          <Link to={"/login"}>Вход</Link>
        </div>
      </div>
    </div>
  );
}
