import React from "react";
import Button from "../../Base/Button/Button";
import Adver from "../Adver/Adver";
import CreateAd from "../CreateAd/CreateAd";
import styles from "./adPage.module.css";

const AdPage = () => {
  return (
    <div>
      <div className={styles.forBtn}>
        <Button value={"Создать кампанию"} />
      </div>
      {/* <CreateAd /> */}
      <div className={styles.ads}>
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
