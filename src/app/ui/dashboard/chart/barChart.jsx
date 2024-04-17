'use client'
import React, { useEffect, useState } from 'react';
import styles from './barChart.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '@/app/firebase/config';
import { getDocs, collection, getDoc, doc } from "firebase/firestore";


async function fetchExpenseFromFirestore() {
    try {
        const expenseDocs = await getDocs(collection(db, 'Expense'));
        const expensesData = {};
        for (const expenseDoc of expenseDocs.docs) {
            const expenseData = expenseDoc.data();
            const userDocRef = doc(db, "User", expenseData.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.data().familyCode === sessionStorage.getItem('familyCode')) {
                const firstName = userDoc.data().firstName;
                if (!expensesData[firstName]) {
                    expensesData[firstName] = { name: firstName, amt: 0 };
                }
                expensesData[firstName].amt += expenseData.amount;
            }
        }

        const dataArray = Object.values(expensesData);
        return dataArray;
    } catch (error) {
        console.error('Error fetching from database: ', error);
        return [];
    }
}

const BarChartComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const expenses = await fetchExpenseFromFirestore();
                console.log('Fetched expenses:', expenses);
                setData(expenses);
            } catch (error) {
                console.error('Error fetching expenses:', error);
                setData([]);
            }
        }
        fetchData();
    }, []);
    

    return (
        <div className={styles.container}>
            <h2>Family Expenses</h2>
            <ResponsiveContainer width="100%" height={300} style={{marginTop: '13%'}}>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amt" fill="white" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
