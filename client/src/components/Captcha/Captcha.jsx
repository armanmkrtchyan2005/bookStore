import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { siteKey } from "config";

const Captcha = ({ onChange = () => {}, onExpired = () => {} }) => {
  return (
    <div className="mb20">
      <ReCAPTCHA sitekey={siteKey} onChange={onChange} onExpired={onExpired} />
    </div>
  );
};

export default Captcha;
