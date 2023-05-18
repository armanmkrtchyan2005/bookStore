import React, { useState } from "react";
import Input from "../../Base/Input/Input";
import styles from "./createAd.module.css";

const CreateAd = () => {
  const [value, setValue] = useState(null);
  return (
    <div className={styles.createAd}>
      <h1>Создание и редактирование кампании</h1>
      <div className={styles.main}>
        <div className={styles.createImg}></div>
        <div className={styles.createInp}>
          <Input type={"text"} placeholder={"Название*"} />
          <Input type={"text"} placeholder={"Дата старта*"} />
          <Input type={"text"} placeholder={"Ссылка на ресурс*"} />
        </div>
      </div>
      <div>
        <input
          type="range"
          min={1}
          max={100}
          onChange={(e) => setValue(e.target.value)}
        />
        <span>{value}</span>
      </div>
    </div>
  );
};

export default CreateAd;
