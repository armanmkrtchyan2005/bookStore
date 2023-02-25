import React from "react";
import Button from "../../Base/Button/Button";
import Adver from "../Adver/Adver";
import CreateAd from "../CreateAd/CreateAd";
import "./adPage.css";

const AdPage = () => {
  return (
    <div>
      <div className="forBtn">
        <Button value={"Создать кампанию"} />
      </div>
      {/* <CreateAd /> */}
      <div className="ads">
        <Adver />
        <Adver />
        <Adver />
        <Adver />
        <Adver />
      </div>
    </div>
  );
};

export default AdPage;
