import React from 'react'
import styles from './Sum.module.css'

const Sum = () => {
    return (
        <div className={styles.sum_main}>
            <p>Ваш заработок за</p>
            <h2>22 000р</h2>
            <button className={styles.sum_button}>Вывести</button>
        </div>
    )
}

export default Sum