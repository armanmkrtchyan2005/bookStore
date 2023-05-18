import React from "react";
import { Link } from "react-router-dom";
import styles from "./adver.module.css";

const Adver = () => {
  return (
    <div className={styles.adv}>
      <div className={styles.main}>
        <div className={styles.img}>{/* <img alt="not found" /> */}</div>
        <div className={styles.text}>
          <h2>Название компании</h2>
          <p>
            Дата старта <span>15 августа 2022</span>
          </p>
          <p>
            Клики <span>12</span>
          </p>
          <Link>www.company.com</Link>
        </div>
      </div>
      <div>
        <div className={styles.values}>
          <p className={styles.firstNum}>350</p>
          <p className={styles.secondNum}>1000</p>
        </div>
        <div className={styles.line}>
          <div
            className={styles.completed}
            style={{ width: (350 * 100) / 1000 + "%" }}
          ></div>
        </div>
      </div>
      <div className={styles.btns}>
        <button className={styles.firstBtn}>Опубликовано</button>
        <button className={styles.secondBtn}>Редактировать</button>
      </div>
    </div>
  );
};

export default Adver;
