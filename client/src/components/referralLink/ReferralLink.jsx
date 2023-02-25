import React from "react";
import './ReferralLink.css'

const ReferralLink = () => {
    return (
        <div className="referralMain">
            <div className="div_referral">
                <div className="div_link">
                    <p>Ваша реферальная ссылка</p>
                    <span>https://www.figma.com/</span>
                </div>
                <div className="div_button">
                    <button>Скопировать</button>
                </div>
            </div>
        </div>

    )
}
export default ReferralLink;