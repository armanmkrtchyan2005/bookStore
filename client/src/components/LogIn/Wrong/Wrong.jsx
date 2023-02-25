import React from "react";
import Button from "../../Base/Button/Button";
import "./wrong.css";

export default function Wrong({ setHandleShow }) {
  return (
    <div className="wrong-back">
      <div className="wrong">
        <p>Данные введены неверно</p>
        <Button disabled={false} value={"Ok"} onClick={setHandleShow} />
      </div>
    </div>
  );
}
