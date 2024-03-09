import React from 'react'
import styles from './card.module.css'
import { MdSupervisedUserCircle } from 'react-icons/md'

const CardMonth = () => {
  return (
    <div className={styles.container}>
        <MdSupervisedUserCircle size={24}/>
        <div className={styles.texts}>
            <span className={styles.title}>Total Expense This Month</span>
            <span className={styles.number}>10000</span>
            <span className={styles.detail}>
                <span className={styles.positive}>12%</span> more than last Month
            </span>
        </div>
    </div>
  )
}

export default CardMonth