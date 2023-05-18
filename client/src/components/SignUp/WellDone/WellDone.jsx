import React, { useContext } from "react";
import Button from "../../Base/Button/Button";
import styles from "./wellDone.module.css";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../../App";
// import { TokenContext } from "App";


export default function WellDone({ token }) {
  const navigate = useNavigate();
  const { setToken } = useContext(TokenContext);
  const handleClick = () => {
    setToken(token);
    localStorage.setItem("token", token);
    navigate("/home")
  };
  return (
    <div className={styles["wrong-back"]}>
      <div className={styles.wellDone}>
        <h1>Вы успешно зарегистрированы!</h1>
        <Button
          className={styles.wellBtn}
          disabled={false}
          value={"Продолжить"}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
