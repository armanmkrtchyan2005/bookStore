import AdPage from "components/advertisement/AdPage/AdPage";
import Forgot from "components/Forgot/Forgot";
import Reset from "components/Forgot/Reset/Reset";
import { LogIn } from "components/LogIn/LogIn";
import SignUp from "components/SignUp/SignUp";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

export const LoginRouter = () => {
  return (
    <Routes>
      <Route path="advertiser" element={<AdPage />} />
      <Route path="login" element={<LogIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="forgot-password" element={<Forgot />} />
      <Route path="forgot-password/reset" element={<Reset />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};
