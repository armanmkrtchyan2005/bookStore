import React from "react";
import Button from "../../Base/Button/Button";
import styles from "./wrong.module.css";

export default function Wrong({ setHandleShow }) {
  return (
    <div className={styles["wrong-back"]}>
      <div className={styles.wrong}>
        <p>Данные введены неверно</p>
        <Button disabled={false} value={"Ok"} onClick={setHandleShow} />
      </div>
    </div>
  );
}
