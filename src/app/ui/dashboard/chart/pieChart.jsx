'use client'
import React, { useEffect, useState } from 'react';
import styles from './pieChart.module.css';
import { db } from "@/app/firebase/config";
import { getDocs, collection, getDoc } from "firebase/firestore";
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';


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

async function fetchTransactionFromFirebase(code) {
  try {
    const expenseDocs = await getDocs(collection(db, 'Expense'));
    const data = [
      { name: 'Food', value: 0, fill: '#f705bb75' },
      { name: 'Groceries', value: 0, fill: '#9cf72c75' },
      { name: 'Health Care', value: 0, fill: '#f7737375' },
      { name: 'Housing and Bills', value: 0, fill: '#fdc200' },
      { name: 'Personal Care', value: 0, fill: '#afd6ee75' },
      { name: 'Transportation Cost', value: 0, fill: '#f7cb7375' },
    ];

    for (const expenseDoc of expenseDocs.docs) {
      const expenseData = expenseDoc.data();
      const userDocRef = doc(db, "User", expenseData.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.data().familyCode === sessionStorage.getItem('familyCode')) {
        const categoryIndex = data.findIndex((category) => category.name === expenseData.category);
        if (categoryIndex !== -1) {
          data[categoryIndex].value += expenseData.amount;
        }
      }
    }
    console.log('data: ', data)
    return data;
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    return [];
  }
}


const data = [
  { name: 'Food', value: 10, fill: '#f705bb75' },
  { name: 'Groceries', value: 10, fill: '#9cf72c75' },
  { name: 'Health Care', value: 10, fill: '#f7737375' },
  { name: 'Housing and Bills', value: 10, fill: '#fdc200' },
  { name: 'Personal Care', value: 10, fill: '#afd6ee75' },
  { name: 'Transportation Cost', value: 10, fill: '#f7cb7375' },
];


const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#fff">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const pieChart = () => {
    const familyCode = sessionStorage.getItem("familyCode");
    const [userData, setUserData] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchData() {
          const data = await fetchFamilyFromFirestore(familyCode);
          setUserData(data);
        }
        fetchData();
    }, []);

    useEffect(() => {
      async function fetchTransactions() {
          const data = await fetchTransactionFromFirebase(familyCode);
          setTransactions(data);
      }
      fetchTransactions();
    }, [familyCode]);

    console.log('Transactions data:', transactions);

    const handleChange = async (e) => {
        console.log('Selected value:', e.target.value);
        const data = await fetchTransactionByID(e.target.value);
        setTransactions(data);
    };

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

    return (
        <div className={styles.container}>

            <div className={styles.align}>
                <h2>Category wise Expenses</h2>

                <select className={styles.familyMember} onChange={handleChange} defaultValue="none">
                    <option value="all" selected>Everyone</option>
                    {userData.map((user) => (
                    <option key={`user_${user.id}`} value={user.id} className={styles.familyMember}>
                        {user.firstName + " " + user.lastName}
                    </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                    />
                </PieChart>
            </ResponsiveContainer>

        </div>
    );
};

export default pieChart;
