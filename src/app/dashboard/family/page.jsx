"use client"

import styles from "../../ui/dashboard/family/users.module.css"
import Search from '../../ui/dashboard/search/Search'
import Link from 'next/link'
import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, {useEffect, useState} from "react";

async function fetchDataFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "User"));
    const data = [];

    querySnapshot.forEach((doc) => {
      if (doc.data().familyCode === "STM") {
        data.push({ id: doc.id, ...doc.data() });
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return [];
  }
}


const UsersPage = () => {
  const [userData, setUserData] = useState([]);

  useEffect(()=>{
    async function fetchData(){
      const data = await fetchDataFromFirestore();
      setUserData(data);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder={"Search for a user"}/>
        <Link href="/dashboard/family/add">
          <button className={styles.addButton}>Add New Member</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Surname</td>
            <td>Username</td>
            <td>Email</td>
          </tr>
        </thead>
        <tbody>

          {userData.map((user)=>(
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href="/">
                    <button className={`${styles.button} ${styles.view}`}>View</button>
                  </Link>
                    <button className={`${styles.button} ${styles.delete}`}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage