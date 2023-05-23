import React from "react";
import styles from "./Navigation.module.css";
import myBook from "../../image/Vector.png";
import MyDetails from "../../image/Vector1.png";
import Monetization from "../../image/Vector2.png";
import Referral from "../../image/Vector3.png";
import { NavLink } from "react-router-dom";

const Navigate = () => {
  return (
    <>
      <div className={styles.div_navigate}>
        <div className={styles.navigate_logo}>
          <h1>LOGO</h1>
        </div>
        <div className={styles.navigate_menu}>
          <ul className={styles.nav_ul}>
            <li className={styles.nav_li}>
              <img src={myBook} alt="" />
              <NavLink
                to={"home"}
                className={({ isActive }) => (isActive ? styles["font-link"] : null)}
              >
                {" "}
                Мои книги{" "}
              </NavLink>
            </li>
            <li className={styles.nav_li}>
              <img src={MyDetails} alt="" />
              <NavLink
                to={"myDetails"}
                className={({ isActive }) => (isActive ? styles["font-link"] : null)}
              >
                {" "}
                Мои данные{" "}
              </NavLink>
            </li>
            <li className={styles.nav_li}>
              <img src={Monetization} alt="" />
              <NavLink
                to={"monetization"}
                className={({ isActive }) => (isActive ? styles["font-link"] : null)}
              >
                {" "}
                Монетизация{" "}
              </NavLink>
            </li>
            <li className={styles.nav_li}>
              <img src={Referral} alt="" />
              <NavLink
                to={"referral"}
                className={({ isActive }) => (isActive ? styles["font-link"] : null)}
              >
                {" "}
                Реферальная система{" "}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default Navigate;
