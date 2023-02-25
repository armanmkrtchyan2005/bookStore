import React, { useState } from "react";
import Input from "../../Base/Input/Input";
import "./createAd.css";

const CreateAd = () => {
  const [value, setValue] = useState(null);
  return (
    <div className="createAd">
      <h1>Создание и редактирование кампании</h1>
      <div className="main">
        <div className="createImg"></div>
        <div className="createInp">
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
