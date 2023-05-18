import React from "react";
import styles from "./ReferralLink.module.css";

const ReferralLink = () => {
  return (
    <div className={styles.referralMain}>
      <div className={styles.div_referral}>
        <div className={styles.div_link}>
          <p>Ваша реферальная ссылка</p>
          <span>https://www.figma.com/</span>
        </div>
        <div className={styles.div_button}>
          <button>Скопировать</button>
        </div>
      </div>
    </div>
  );
};
export default ReferralLink;
