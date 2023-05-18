import { useState } from "react";
import React from "react";
import styles from "./Monetization.module.css";
import Calendar from "components/calendar/Calendar";

const Monetization = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className={styles.main_advertisement}>
        <div className={styles.div_advertisement}>
          <p>Общее количество показов рекламы</p>
          <h3>22 898</h3>
        </div>
        <div className={styles.div_advertisement}>
          <div className={styles.div_min}>
            <p>Количество показов рекламы за неоплаченный период</p>
            <h4>
              Вывод средств можно заказывать после достижения 5000 и более
              показов рекламы в книгах автор
            </h4>
          </div>
          <div className={styles.div_min}>
            <div className={styles.div_min_top}>
              <span>Доступные для вывода </span>
              <label>8 898</label>
            </div>
            <div className={styles.div_min_bottom}>
              <span>Доступные для вывода </span>
              <label>12 545</label>
            </div>
          </div>
        </div>
      </div>
      <Calendar date={date} setDate={setDate} />
    </div>
  );
};
export default Monetization;
