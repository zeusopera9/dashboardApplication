import React, { useEffect, useState } from 'react';
import styles from './card.module.css';
import { MdSupervisedUserCircle } from 'react-icons/md';
import { db } from "@/app/firebase/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";

async function fetchTransactionForDay(userID, startOfToday, endOfToday) {
  try {
    const expenseDocs = await getDocs(collection(db,'Expense'));
    const todayData = [];
    const yesterdayData = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = Timestamp.fromDate(new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0));
    const endOfYesterday = Timestamp.fromDate(new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59));

    for (const expenseDoc of expenseDocs.docs) {
      const expenseData = expenseDoc.data();
      if (expenseData.uid === userID) {
        if (expenseData.date >= startOfToday && expenseData.date <= endOfToday) {
          todayData.push(expenseData.amount);
        }
        if (expenseData.date >= startOfYesterday && expenseData.date <= endOfYesterday) {
          yesterdayData.push(expenseData.amount);
        }
      }
    }
    return { todayData, yesterdayData };
  } catch (error) {
    console.error("Error fetching Transactions: ", error);
    return { todayData: [], yesterdayData: [] };
  }
}

const CardDay = () => {
  const [todayTransactions, setTodayTransactions] = useState([]);
  const [yesterdayTransactions, setYesterdayTransactions] = useState([]);
  const uid = sessionStorage.getItem('uid');

  useEffect(() => {
    const today = new Date();
    const startOfToday = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    const endOfToday = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59));

    async function fetchData() {
      const { todayData, yesterdayData } = await fetchTransactionForDay(uid, startOfToday, endOfToday);
      setTodayTransactions(todayData);
      setYesterdayTransactions(yesterdayData);
    }
    fetchData();
  }, [uid]);

  const todayTotal = todayTransactions.reduce((total, amount) => total + amount, 0);
  const yesterdayTotal = yesterdayTransactions.reduce((total, amount) => total + amount, 0);
  const multiplier = (todayTotal / yesterdayTotal).toFixed(2);
  const displayText = isFinite(multiplier) && multiplier !== "Infinity" ? `${multiplier}x` : "0x";

  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24}/>
      <div className={styles.texts}>
        <span className={styles.title}>Total Expense Today</span>
        <span className={styles.number}>{todayTotal}</span>
        {isFinite(multiplier) && multiplier !== "Infinity" && (
          <span className={todayTotal > yesterdayTotal ? styles.negative : styles.positive}>
            {todayTotal > yesterdayTotal ? `${displayText} more` : `${displayText} less`} than yesterday.
          </span>
        )}
      </div>
    </div>
  );
};

export default CardDay;
