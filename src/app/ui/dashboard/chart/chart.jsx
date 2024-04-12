import React, { useState, useEffect } from 'react';
import styles from "./chart.module.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from "@/app/firebase/config";
import { Timestamp, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

async function fetchExpenseData(setExpenseData) {
  try {
    const today = new Date();
    const startOfCurrentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfCurrentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()), 23, 59, 59);
    
    const expenseDocsQuery = query(
      collection(db, "Expense"),
      where("date", ">=", Timestamp.fromDate(startOfCurrentWeek)),
      where("date", "<=", Timestamp.fromDate(endOfCurrentWeek))
    );
    const expenseDocsSnapshot = await getDocs(expenseDocsQuery);
    const data = {};

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    daysOfWeek.forEach(day => {
      data[day] = {};
    });

    const familyMembers = {}; 
    for (const expenseDoc of expenseDocsSnapshot.docs) {
      const expenseData = expenseDoc.data();
      const userDocRef = doc(db, "User", expenseData.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.data().familyCode === sessionStorage.getItem('familyCode')) {
        const expenseDate = expenseData.date.toDate().toLocaleDateString('en-US', { weekday: 'long' });
        const key = `${expenseDate}_${userDoc.data().firstName}`;
        if (!familyMembers[userDoc.data().firstName]) {
          familyMembers[userDoc.data().firstName] = true;
          daysOfWeek.forEach(day => {
            data[day][userDoc.data().firstName] = 0;
          });
        }
        if (data[expenseDate][userDoc.data().firstName]) {
          data[expenseDate][userDoc.data().firstName] += expenseData.amount;
        } else {
          data[expenseDate][userDoc.data().firstName] = expenseData.amount;
        }
      }
    }

    const formattedData = Object.keys(data).map(day => ({
      day,
      ...data[day]
    }));

    const sortedData = formattedData.sort((a, b) => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });

    setExpenseData(sortedData);

    console.log("Expense Data:", sortedData);

  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    throw error;
  }
}


const data = [
  {
    name: 'Sunday',
    Yakshit: 3701,
    Zaidali: 2888,
    Shubraja: 4333,
  },
  {
    name: 'Monday',
    Shubraja: 2021,
    Yakshit: 1922,
    Zaidali: 3567,
  },
  {
    name: 'Tuesday',
    Shubraja: 4977,
    Yakshit: 4123,
    Zaidali: 4999,
  },
  {
    name: 'Wednesday',
    Shubraja: 2444,
    Yakshit: 3010,
    Zaidali: 4855,
  },
  {
    name: 'Thursday',
    Shubraja: 3700,
    Yakshit: 4990,
    Zaidali: 2654,
  },
  {
    name: 'Friday',
    Shubraja: 1356,
    Yakshit: 4123,
    Zaidali: 2987,
  },
  {
    name: 'Saturday',
    Shubraja: 4877,
    Yakshit: 3402,
    Zaidali: 4655,
  },
];

const Chart = () => {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    fetchExpenseData(setExpenseData);
  }, []);

  const [usedColors, setUsedColors] = useState([]);
  useEffect(() => {
    const randomComponent = () => Math.floor(Math.random() * 190) + 55;
    const colors = [];
    for (let i = 0; i < Object.keys(data[0]).length - 1; i++) {
      let color;
      do {
        const red = randomComponent();
        const green = randomComponent();
        const blue = randomComponent();
        color = `rgb(${red}, ${green}, ${blue})`;
      } while (colors.includes(color));
      colors.push(color);
    }
    setUsedColors(colors);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={expenseData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip contentStyle={{background: "#151c2c"}}/>
          <Legend />
          {Object.keys(data[0])
            .filter(key => key !== 'name')
            .map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={usedColors[index]}
                strokeDasharray="5 5"
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
