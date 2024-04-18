'use client'
import React, {useState, useEffect} from 'react'
import PieChart from '../../ui/dashboard/chart/pieChart'
import BarChart from '../../ui/dashboard/chart/barChart'
import LineChart from '../../ui/dashboard/chart/lineChart'
import styles from '../../ui/dashboard/reports/reports.module.css'
import { db } from "@/app/firebase/config";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";

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

const ReportsPage = () => {
  const familyCode = sessionStorage.getItem("familyCode");
    const [userData, setUserData] = useState([]);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState('all');

    useEffect(() => {
      async function fetchData() {
        const data = await fetchFamilyFromFirestore(familyCode);
        setUserData(data);
      }
      fetchData();
    }, [familyCode]);
  
    const handleChange = (e) => {
      setSelectedFamilyMember(e.target.value);
    };

  return (
    <div>
      <div className={styles.top}>
        <h2>
          View Category Wise and Weekly Expenses of: 
        </h2>
        <select className={styles.familyMember} onChange={handleChange} defaultValue="none">
          <option value="all" selected>Everyone</option>
          {userData.map((user) => (
          <option key={`user_${user.id}`} value={user.id} className={styles.familyMember}>
              {user.firstName + " " + user.lastName}
          </option>
          ))}
        </select>
      </div>

      <div className={styles.charts}>
          <PieChart selectedFamilyMember={selectedFamilyMember} />
          <BarChart/>
      </div>
      <LineChart selectedFamilyMember={selectedFamilyMember} />
    </div>
  )
}

export default ReportsPage