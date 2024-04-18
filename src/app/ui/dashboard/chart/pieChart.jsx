'use client'
import React, { useEffect, useState } from 'react';
import styles from './pieChart.module.css';
import { db } from "@/app/firebase/config";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';


async function fetchTransactionFromFirebase(selectedFamilyMember) {
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
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), startOfWeek.getDate() + 6);

    if(selectedFamilyMember=='all'){
      for (const expenseDoc of expenseDocs.docs) {
        const expenseData = expenseDoc.data();
        const expenseDate = new Date(expenseData.date.seconds * 1000); 
        const userDocRef = doc(db, "User", expenseData.uid);
        const userDoc = await getDoc(userDocRef);
        if (expenseDate >= startOfWeek && expenseDate <= endOfWeek) {
          if (userDoc.data().familyCode === sessionStorage.getItem("familyCode")) {
            const categoryIndex = data.findIndex((category) => category.name === expenseData.category);
            if (categoryIndex !== -1) {
              data[categoryIndex].value += expenseData.amount;
            }
          }
        }
      }
    }
    else{
      for (const expenseDoc of expenseDocs.docs) {
        const expenseData = expenseDoc.data();
        const expenseDate = new Date(expenseData.date.seconds * 1000); 
        const userDocRef = doc(db, "User", expenseData.uid);
        const userDoc = await getDoc(userDocRef);
        if (expenseDate >= startOfWeek && expenseDate <= endOfWeek) {
          if (userDoc.data().familyCode === sessionStorage.getItem("familyCode") && expenseData.uid === selectedFamilyMember) {
            const categoryIndex = data.findIndex((category) => category.name === expenseData.category);
            if (categoryIndex !== -1) {
              data[categoryIndex].value += expenseData.amount;
            }
          }
        }
      }
    }
    return data;
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    return [];
  }
}

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

const pieChart = ({ selectedFamilyMember }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      console.log('Selected Family Member:', selectedFamilyMember);
      async function fetchTransactions() {
          const data = await fetchTransactionFromFirebase(selectedFamilyMember);
          setTransactions(data);
      }
      fetchTransactions();
    }, [selectedFamilyMember]);
  


  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

    return (
        <div className={styles.container}>

            <div className={styles.align}>
                <h2>Category wise Expenses</h2>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={transactions}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={120}
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
