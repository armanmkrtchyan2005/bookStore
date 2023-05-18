import { CloseIcon } from "assets/icons/closeIcon";
import React, { useState } from "react";
import CalendarImg from "../../image/calendar.png";
import styles from "./calendar.module.css";

import InfiniteCalendar from "@appannie/react-infinite-calendar";
import "@appannie/react-infinite-calendar/styles.css"; // only needs to be imported once

const Calendar = ({ setDate, date }) => {
  const [calendar, setCalendar] = useState(false);

  const calendarShow = () => {
    setCalendar(!calendar);
  };

  const courantDate = new Date().getFullYear();

  return (
    <div className={styles.calendarMain}>
      <div className={styles.calendarButton} onClick={calendarShow}>
        <img src={CalendarImg} alt="" />
        <h2>За весь период</h2>
      </div>
      {calendar ? (
        <div className={styles["calendar-container"]}>
          <div className={styles.calendarTitle}>
            <h1 className={styles.title}>Выберите период</h1>
            <div className={styles.showYear}>
              <span className={styles.courantYear}>{courantDate}</span>
              <span className={styles.year}>{courantDate - 1}</span>
            </div>
            <button
              className={styles.closeIcon}
              onClick={() => setCalendar(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <div className={styles.calendarBox}>
            <InfiniteCalendar
              displayOptions={{
                layout: "portrait",
                showOverlay: false,
                shouldHeaderAnimate: false,
                showHeader: false,
              }}
              disabledDays={[0, 6]}
            />
          </div>
          <button className={styles.doneBtn} onClick={() => setCalendar(false)}>
            Продолжить
          </button>
        </div>
      ) : null}
    </div>
  );
};
export default Calendar;
