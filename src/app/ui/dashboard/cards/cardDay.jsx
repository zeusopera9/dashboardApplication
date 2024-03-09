import React from 'react'
import styles from './card.module.css'
import { MdSupervisedUserCircle } from 'react-icons/md'

const CardDay = () => {
  return (
    <div className={styles.container}>
        <MdSupervisedUserCircle size={24}/>
        <div className={styles.texts}>
            <span className={styles.title}>Total Expense Today</span>
            <span className={styles.number}>10000</span>
            <span className={styles.detail}>
                <span className={styles.positive}>12%</span> more than yesterday
            </span>
        </div>
    </div>
  )
}

export default CardDay