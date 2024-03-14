"use client"

import styles from "../../ui/dashboard/family/users.module.css"
import Search from '../../ui/dashboard/search/Search'
import Link from 'next/link'
import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, {useEffect, useState} from "react";

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

const UsersPage = () => {
  const [userData, setUserData] = useState([]);
  const head = sessionStorage.getItem('head');

  useEffect(()=>{
    const familyCode = sessionStorage.getItem("familyCode");
    async function fetchData(){
      const data = await fetchFamilyFromFirestore(familyCode);
      setUserData(data);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder={"Search for a user"}/>
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
                  {head === 'true' && (
                    <button className={`${styles.button} ${styles.delete}`}>Delete</button>
                  )}
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