import { CloseIcon } from "assets/icons/closeIcon";
import React, { useState } from "react";
import CalendarImg from "../../image/calendar.png";
import './calendar.css'

import InfiniteCalendar from '@appannie/react-infinite-calendar';
import '@appannie/react-infinite-calendar/styles.css'; // only needs to be imported once




const Calendar = ({ setDate, date }) => {
    const [calendar, setCalendar] = useState(false)

    const calendarShow = () => {
        setCalendar(!calendar)
    }

    const courantDate = new Date().getFullYear()
    

    return (
        <div className="calendarMain">
            <div className='calendarButton' onClick={calendarShow}>
                <img src={CalendarImg} alt="" />
                <h2>За весь период</h2>
            </div>
            {calendar ? 
                <div className='calendar-container'>
                    <div className="calendarTitle">
                        <h1 className="title">Выберите период</h1>
                        <div className="showYear">
                            <span className="courantYear">{courantDate}</span>
                            <span className="year">{courantDate - 1}</span>
                        </div>
                        <button className="closeIcon" onClick={() => setCalendar(false)}><CloseIcon /></button>
                    </div>
                    <div className="calendarBox">
                    <InfiniteCalendar
                            displayOptions={{
                                layout: 'portrait',
                                showOverlay: false,
                                shouldHeaderAnimate: false,
                                showHeader: false
                            }}
                        
                        disabledDays={[0, 6]}
                    />
                    </div>
                    <button className="doneBtn" onClick={() => setCalendar(false)}>Продолжить</button>
                    
                </div>
             : null
            }
        </div>
    )
}
export default Calendar