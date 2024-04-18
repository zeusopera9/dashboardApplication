import React, { useEffect, useState } from 'react';
import AssetChart from './assetChart';
import { db } from "@/app/firebase/config";
import { getDocs, collection } from "firebase/firestore";
import styles from './assetChart.module.css';

async function fetchFamilyFromFirestore() {
  try {
    const userDocs = await getDocs(collection(db, "User"));
    const data = [];

    userDocs.forEach((doc) => {
      const userData = doc.data();
      if (userData.familyCode === sessionStorage.getItem('familyCode')) {
        const filteredData = {
          firstname: userData.firstName,
          lastname: userData.lastName,
          uid: doc.id,
          familyCode: userData.familyCode,
        };
        data.push(filteredData);
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return [];
  }
}

const ViewAssets = () => {
  const [userData, setUserData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      const data = await fetchFamilyFromFirestore();
      setUserData(data);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.chartRow}>
        {userData.map((user) => (
          <div key={user.uid}>
            <div className={styles.chartContainer}>
              <h2>{user.firstname} {user.lastname}</h2>
              <AssetChart uid={user.uid} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAssets;
