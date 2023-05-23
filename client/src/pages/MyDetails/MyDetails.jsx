import React from 'react'
import PersonalDetails from 'components/PersonalDetails/PersonalDetails'
import Sum from 'components/Sum/Sum'
import styles from './MyDetails.module.css'
const MyDetails = () => {
  return (
    <div className={styles.myDetails_main}>
        <Sum />
        <PersonalDetails />
    </div>
  )
}

export default MyDetails