import React, { useEffect, useState } from 'react';
import styles from './card.module.css';
import { MdSupervisedUserCircle } from 'react-icons/md';
import { db } from "@/app/firebase/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";

async function fetchTransactionsForMonth(userID, startOfCurrentMonth, endOfCurrentMonth, startOfLastMonth, endOfLastMonth) {
  try {
    const expenseDocs = await getDocs(collection(db,'Expense'));
    const currentMonthData = [];
    const lastMonthData = [];

    for (const expenseDoc of expenseDocs.docs) {
      const expenseData = expenseDoc.data();
      if (expenseData.uid === userID) {
        if (expenseData.date >= startOfCurrentMonth && expenseData.date <= endOfCurrentMonth) {
          currentMonthData.push(expenseData.amount);
        }
        if (expenseData.date >= startOfLastMonth && expenseData.date <= endOfLastMonth) {
          lastMonthData.push(expenseData.amount);
        }
      }
    }
    return { currentMonthData, lastMonthData };
  } catch (error) {
    console.error("Error fetching Transactions: ", error);
    return { currentMonthData: [], lastMonthData: [] };
  }
}

const CardMonth = () => {
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState([]);
  const [lastMonthTransactions, setLastMonthTransactions] = useState([]);
  const uid = sessionStorage.getItem('uid');

  useEffect(() => {
    const today = new Date();
    const startOfCurrentMonth = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0));
    const endOfCurrentMonth = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59));
    const startOfLastMonth = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0));
    const endOfLastMonth = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59));

    async function fetchData() {
      const { currentMonthData, lastMonthData } = await fetchTransactionsForMonth(uid, startOfCurrentMonth, endOfCurrentMonth, startOfLastMonth, endOfLastMonth);
      setCurrentMonthTransactions(currentMonthData);
      setLastMonthTransactions(lastMonthData);
    }
    fetchData();
  }, [uid]);

  const currentMonthTotal = currentMonthTransactions.reduce((total, amount) => total + amount, 0);
  const lastMonthTotal = lastMonthTransactions.reduce((total, amount) => total + amount, 0);
  const multiplier = (currentMonthTotal / lastMonthTotal).toFixed(2);
  const displayText = isFinite(multiplier) && multiplier !== "Infinity" ? `${multiplier}x` : "0x";

  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24}/>
      <div className={styles.texts}>
        <span className={styles.title}>Total Expense This Month</span>
        <span className={styles.number}>{currentMonthTotal}</span>
        {isFinite(multiplier) && multiplier !== "Infinity" && (
          <span className={currentMonthTotal > lastMonthTotal ? styles.negative : styles.positive}>
            {currentMonthTotal > lastMonthTotal ? `${displayText} more` : `${displayText} less`} than last month
          </span>
        )}
      </div>
    </div>
  );
};

export default CardMonth;
