import { db } from "@/app/firebase/config";
import { collection, getDocs, getDoc, doc, where, query, Timestamp } from "firebase/firestore";
import React, { useEffect, useState, useMemo } from "react";
import styles from './transactions.module.css';

async function fetchTransactionsFromFirestore() {
    try {
        const today = new Date();
        const startOfCurrentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfCurrentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()), 23, 59, 59);
        
        const expenseDocsQuery = query(collection(db, "Expense"),
            where("date", ">=", Timestamp.fromDate(startOfCurrentWeek)),
            where("date", "<=", Timestamp.fromDate(endOfCurrentWeek))
        );
        const expenseDocsSnapshot = await getDocs(expenseDocsQuery);

        const data = [];

        for (const expenseDoc of expenseDocsSnapshot.docs) {
            const expenseData = expenseDoc.data();
            const userDocRef = doc(db, "User", expenseData.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.data().familyCode == sessionStorage.getItem('familyCode')) {
                const transaction = {
                    id: expenseData.uid,
                    amount: expenseData.amount,
                    category: expenseData.category,
                    date: expenseData.date,
                    firstName: userDoc.data().firstName,
                    lastName: userDoc.data().lastName
                };
                data.push(transaction);
            }
        }

        return data;
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        throw error;
    }
}

const Transactions = () => {
    const getCategoryClassName = category => {
        switch (category.toLowerCase()) {
            case 'food':
                return styles.food;
            case 'groceries':
                return styles.groceries;
            case 'health care':
                return styles.health;
            case 'housing and bills':
                return styles.housing;
            case 'personal care':
                return styles.personal;
            case 'transportation cost':
                return styles.transportation;
            default:
                return '';
        }
    };

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchTransactionsFromFirestore();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        }
        fetchData();
    }, []);

    const formattedTransactions = useMemo(() => {
        return transactions.map(transaction => {
            const transactionDate = transaction.date.toDate();
            const formattedDate = transactionDate.toLocaleDateString();
            return {
                ...transaction,
                name: `${transaction.firstName} ${transaction.lastName}`,
                formattedDate: formattedDate
            };
        });
    }, [transactions]);


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
                    {formattedTransactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.name}</td>
                            <td>{transaction.formattedDate}</td>
                            <td>Rs {transaction.amount}</td>
                            <td>
                                <span className={`${styles.status} ${getCategoryClassName(transaction.category)}`}>
                                    {transaction.category}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
