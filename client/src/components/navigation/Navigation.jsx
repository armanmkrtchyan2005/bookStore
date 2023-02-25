import React from "react";
import "./Navigation.css";
import myBook from "../../image/Vector.png";
import MyDetails from "../../image/Vector1.png";
import Monetization from "../../image/Vector2.png";
import Referral from "../../image/Vector3.png";
import { NavLink } from "react-router-dom";

const Navigate = () => {
  return (
    <>
      <div className="div_navigate">
        <div className="navigate_logo">
          <h1>LOGO</h1>
        </div>
        <div className="navigate_menu">
          <ul className="nav_ul">
            <li className="nav_li">
              <img src={myBook} alt="" />
              <NavLink
                to={"home"}
                className={({ isActive }) => (isActive ? "font-link" : null)}
              >
                {" "}
                Мои книги{" "}
              </NavLink>
            </li>
            <li className="nav_li">
              <img src={MyDetails} alt="" />
              <NavLink
                to={"myDetails"}
                className={({ isActive }) => (isActive ? "font-link" : null)}
              >
                {" "}
                Мои данные{" "}
              </NavLink>
            </li>
            <li className="nav_li">
              <img src={Monetization} alt="" />
              <NavLink
                to={"monetization"}
                className={({ isActive }) => (isActive ? "font-link" : null)}
              >
                {" "}
                Монетизация{" "}
              </NavLink>
            </li>
            <li className="nav_li">
              <img src={Referral} alt="" />
              <NavLink
                to={"referral"}
                className={({ isActive }) => (isActive ? "font-link" : null)}
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
