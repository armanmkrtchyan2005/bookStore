import React, { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const NavigateComp = lazy(() => import("components/navigation/Navigation"));
const HomePage = lazy(() => import("pages/Home/Home"));
const ReferralLink = lazy(() => import("components/referralLink/ReferralLink"));
const Monetization = lazy(() => import("components/monetization/Monetization"));

export const DashboardRouter = () => {
  return (
    <>
      <div className="div_nav">
        <NavigateComp />
      </div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/monetization" element={<Monetization />} />
        <Route path="/referral" element={<ReferralLink />} />
        <Route path="*" element={<Navigate to="home" />} />
      </Routes>
    </>
  );
};
