"use client"
import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState, useMemo } from "react";
import styles from "../../ui/dashboard/transactions/transactions.module.css";

async function fetchFamilyFromFirestore(familyCode) {
  try {
    const userDocs = await getDocs(collection(db, "User"));
    const data = [];

    userDocs.forEach((doc) => {
      if (doc.data().familyCode === familyCode) {
        data.push({ id: doc.id, ...doc.data() });
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return [];
  }
}

async function fetchTransactionByID(userID) {
  try {
    const expenseDocs = await getDocs(collection(db, 'Expense'));
    const data = [];

    for (const expenseDoc of expenseDocs.docs) {
      const expenseData = expenseDoc.data();
      if (expenseData.uid === userID) {
        const transaction = {
          id: expenseDoc.id,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date,
          mode: expenseData.mode
        };
        data.push(transaction);
      }
    }
    return data;
  } catch (error) {
    console.error("Error fetching transaction from db: ", error);
    return [];
  }
}

const TransactionsPage = () => {
  const getCategoryClassName = category => {
    switch (category.toLowerCase()) {
      case 'food':
        return styles.food;
      case 'groceries':
        return styles.groceries;
      case 'health care':
        return styles.health;
      case 'housing':
        return styles.housing;
      case 'personal care':
        return styles.personal;
      case 'transportation':
        return styles.transportation;
      default:
        return '';
    }
  };
  const [transactions, setTransactions] = useState([]);
  const familyCode = sessionStorage.getItem("familyCode");

  const handleChange = async (e) => {
    console.log('Selected value:', e.target.value);
    const data = await fetchTransactionByID(e.target.value);
    setTransactions(data);
  };
  const [userData, setUserData] = useState([]);
  
  const formattedTransactions = useMemo(() => {
    return transactions.map(transaction => {
      const transactionDate = transaction.date.toDate();
      const formattedDate = transactionDate.toLocaleDateString();
      return {
        ...transaction,
        formattedDate: formattedDate
      };
    });
  }, [transactions]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchFamilyFromFirestore(familyCode);
      setUserData(data);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <label htmlFor="familyMember">Family Member:</label>
      <select className={styles.familyMember} onChange={handleChange} defaultValue="none">
        <option value="none" disabled>Select</option>
        {userData.map((user) => (
          <option key={`user_${user.id}`} value={user.id} className={styles.familyMember}>
            {user.firstName + " " + user.lastName}
          </option>
        ))}
      </select>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Date</td>
            <td>Amount</td>
            <td>Category</td>
            <td>Mode</td>
          </tr>
        </thead>
        <tbody>
        {formattedTransactions.map(transaction => (
          <tr key={`transaction_${transaction.id}`}>
            <td>{transaction.formattedDate}</td>
            <td>Rs {transaction.amount}</td>
            <td>
              <span className={`${styles.status} ${getCategoryClassName(transaction.category)}`}>
                {transaction.category}
              </span>
            </td>
            <td>{transaction.mode}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;
