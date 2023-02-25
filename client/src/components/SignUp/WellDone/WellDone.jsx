import React from "react";
import { redirect, useNavigate } from "react-router-dom";
import Button from "../../Base/Button/Button";
import "./wellDone.css";

export default function WellDone() {
  const navigate = useNavigate();
  return (
    <div className="wrong-back">
      <div className="wellDone">
        <h1>Вы успешно зарегистрированы!</h1>
        <Button
          className="wellBtn"
          disabled={false}
          value={"Продолжить"}
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
}
