'use client'
import React, { useEffect, useState } from 'react';
import { db } from "@/app/firebase/config";
import { Timestamp, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import styles from "./chart.module.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

async function fetchWeeklyExpenseData(expenseData, setExpenseData) {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const expenseDocsQuery = query(
      collection(db, "Expense"),
      where("date", ">=", Timestamp.fromDate(startOfMonth)),
      where("date", "<=", Timestamp.fromDate(endOfMonth))
    );
    const expenseDocsSnapshot = await getDocs(expenseDocsQuery);
    const data = {};

    const weeksInMonth = [];
    const weekStart = new Date(startOfMonth);
    while (weekStart <= endOfMonth) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weeksInMonth.push({start: new Date(weekStart), end: new Date(weekEnd) });
      weekStart.setDate(weekStart.getDate() + 7);
    }

    weeksInMonth.forEach((week, index) => {
        const weekLabel = `Week ${index + 1}`;
        data[weekLabel] = { expense: 0 };
        
        expenseDocsSnapshot.forEach(expenseDoc => {
          const expenseData = expenseDoc.data();
          const expenseDate = expenseData.date.toDate();
          if (expenseDate >= week.start && expenseDate <= week.end) {
            data[weekLabel]['expense'] += expenseData.amount;
          }
        });
    });
      

    const formattedData = Object.keys(data).map(weekLabel => ({
      week: weekLabel,
      ...data[weekLabel]
    }));

    setExpenseData(formattedData);
    console.log("Weekly Expense Data:", formattedData);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    throw error;
  }
}


const LineChartComponent = () => {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    fetchWeeklyExpenseData(expenseData, setExpenseData);
  }, []);

  return (
    <div className={styles.container}>
      <h2>Weekly Expenses</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={expenseData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip contentStyle={{ background: "#151c2c" }} />
          <Legend />
          {Object.keys(expenseData[0] || {})
            .filter(key => key !== 'week')
            .map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
