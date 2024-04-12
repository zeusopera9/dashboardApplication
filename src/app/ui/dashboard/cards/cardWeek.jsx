import React, { useEffect, useState } from 'react';
import styles from './card.module.css';
import { MdSupervisedUserCircle } from 'react-icons/md';
import { db } from "@/app/firebase/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";

async function fetchTransactionsForWeek(userID, startOfCurrentWeek, endOfCurrentWeek, startOfLastWeek, endOfLastWeek) {
  try {
    const expenseDocs = await getDocs(collection(db,'Expense'));
    const currentWeekData = [];
    const lastWeekData = [];

    for (const expenseDoc of expenseDocs.docs) {
      const expenseData = expenseDoc.data();
      if (expenseData.uid === userID) {
        if (expenseData.date >= startOfCurrentWeek && expenseData.date <= endOfCurrentWeek) {
          currentWeekData.push(expenseData.amount);
        }
        if (expenseData.date >= startOfLastWeek && expenseData.date <= endOfLastWeek) {
          lastWeekData.push(expenseData.amount);
        }
      }
    }
    return { currentWeekData, lastWeekData };
  } catch (error) {
    console.error("Error fetching Transactions: ", error);
    return { currentWeekData: [], lastWeekData: [] };
  }
}

const CardWeek = () => {
  const [currentWeekTransactions, setCurrentWeekTransactions] = useState([]);
  const [lastWeekTransactions, setLastWeekTransactions] = useState([]);
  const uid = sessionStorage.getItem('uid');

  useEffect(() => {
    const today = new Date();
    const currentWeekDay = today.getDay();
    const startOfCurrentWeek = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - currentWeekDay, 0, 0, 0));
    const endOfCurrentWeek = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59));
    const startOfLastWeek = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - currentWeekDay - 7, 0, 0, 0));
    const endOfLastWeek = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - currentWeekDay - 1, 23, 59, 59));

    async function fetchData() {
      const { currentWeekData, lastWeekData } = await fetchTransactionsForWeek(uid, startOfCurrentWeek, endOfCurrentWeek, startOfLastWeek, endOfLastWeek);
      setCurrentWeekTransactions(currentWeekData);
      setLastWeekTransactions(lastWeekData);
    }
    fetchData();
  }, [uid]);

  const currentWeekTotal = currentWeekTransactions.reduce((total, amount) => total + amount, 0);
  const lastWeekTotal = lastWeekTransactions.reduce((total, amount) => total + amount, 0);
  const multiplier = (currentWeekTotal / lastWeekTotal).toFixed(2);
  const displayText = isFinite(multiplier) && multiplier !== "Infinity" ? `${multiplier}x` : "0x";

  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24}/>
      <div className={styles.texts}>
        <span className={styles.title}>Total Expense This Week</span>
        <span className={styles.number}>{currentWeekTotal}</span>
        {isFinite(multiplier) && multiplier !== "Infinity" && (
          <span className={currentWeekTotal > lastWeekTotal ? styles.negative : styles.positive}>
            {currentWeekTotal > lastWeekTotal ? `${displayText} more` : `${displayText} less`} than last week
          </span>
        )}
      </div>
    </div>
  );
};

export default CardWeek;
