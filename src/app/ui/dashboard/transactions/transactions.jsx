import React from 'react'
import styles from './transactions.module.css'

const Transactions = () => {
  return (
    <div className={styles.container}>
        <h2 className={styles.title}>Latest Transactions</h2>
        <table className={styles.table}>
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Date</td>
                    <td>Amount</td>
                    <td>Category</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><div className={styles.user}>Yakshit Poojary</div></td>
                    <td>08-03-2024</td>
                    <td>Rs 1819</td>
                    <td>
                        <span className={`${styles.status} ${styles.food}`}>Food</span>
                    </td>
                </tr>
                <tr>
                    <td><div className={styles.user}>Zaidali Merchant</div></td>
                    <td>08-03-2024</td>
                    <td>Rs 1919</td>
                    <td>
                        <span className={`${styles.status} ${styles.groceries}`}>Groceries</span>
                    </td>
                </tr>
                <tr>
                    <td><div className={styles.user}>Shubraja Lalith</div></td>
                    <td>08-03-2024</td>
                    <td>Rs 1011</td>
                    <td>
                        <span className={`${styles.status} ${styles.health}`}>Health</span>
                    </td>
                </tr>
                <tr>
                    <td><div className={styles.user}>Yakshit Poojary</div></td>
                    <td>08-03-2024</td>
                    <td>Rs 1111</td>
                    <td>
                        <span className={`${styles.status} ${styles.housing}`}>Housing and Bills</span>
                    </td>
                </tr>
                <tr>
                    <td><div className={styles.user}>Zaidali Merchant</div></td>
                    <td>08-03-2024</td>
                    <td>Rs 9191</td>
                    <td>
                        <span className={`${styles.status} ${styles.personal}`}>Personal Care</span>
                    </td>
                </tr>
                <tr>
                    <td><div className={styles.user}>Shubraja Lalith</div></td>
                    <td>08-03-2024</td>
                    <td>Rs 9191</td>
                    <td>
                        <span className={`${styles.status} ${styles.transportation}`}>Transportation</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Transactions