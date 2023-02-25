import { createContext, useState } from "react";
import { DashboardRouter } from "routes/dashboard/DashboardRouter";
import { LoginRouter } from "routes/login/LoginRouter";
import "./main.css";

export const TokenContext = createContext({
  token: localStorage.getItem("token") || "",
  setToken: (callback = (prev = "") => {}) => {},
});

export const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <div className="div_main">
        {token ? <DashboardRouter /> : <LoginRouter />}
      </div>
    </TokenContext.Provider>
  );
};
