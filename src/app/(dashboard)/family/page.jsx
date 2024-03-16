"use client"
import styles from "../../ui/dashboard/family/users.module.css";
import Search from '../../ui/dashboard/search/Search';
import Link from 'next/link';
import { db } from "@/app/firebase/config";
import { collection, getDocs, getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

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

async function toggleJoining(allowJoining, familyCode, setAllowJoining) {
  try {
    const toggleDoc = await getDoc(doc(db, "FamilyCodes", familyCode));
    if (toggleDoc.exists()) {
      const toggleData = toggleDoc.data();
      const updatedAllowJoining = !toggleData.allowJoining;
      sessionStorage.setItem("allowJoining", updatedAllowJoining);
      setAllowJoining(updatedAllowJoining);
      await updateDoc(doc(db, "FamilyCodes", familyCode), { allowJoining: updatedAllowJoining });
      console.log(`Allow Joining toggled to ${updatedAllowJoining ? 'On' : 'Off'}`);
    }
  } catch (error) {
    console.error("Error toggling: ", error);
  }
}

async function deleteFromFamily(deleteEmail){
  try{
    const userDocs = await getDocs(collection(db,'User'));
    for(const userDoc of userDocs.docs){
      if(userDoc.data().email === deleteEmail){
        await deleteDoc(doc(db,'User',userDoc.id));
        console.log(`Deleted user with email ${deleteEmail}`);
        break;
      }
    }
  }
  catch(error){
    console.error("Error Deleting: ", error);
  }
}

const UsersPage = () => {
  const [userData, setUserData] = useState([]);
  const [allowJoining, setAllowJoining] = useState(sessionStorage.getItem("allowJoining") === 'true');
  const head = sessionStorage.getItem('head');
  const familyCode = sessionStorage.getItem("familyCode");

  useEffect(() => {
    async function fetchData() {
      const data = await fetchFamilyFromFirestore(familyCode);
      setUserData(data);
    }
    
    fetchData();
  }, []);

  const handleToggleJoining = () => {
    toggleJoining(allowJoining, familyCode, setAllowJoining);
  };

  const handleDeleteUser = (deleteEmail) => {
    deleteFromFamily(deleteEmail);
    const updatedUserData = userData.filter(user => user.email !== deleteEmail);
    setUserData(updatedUserData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder={"Search for a user"} />
        {head==="true" && (
          <button
            className={`${styles.button} ${styles.toggleButton} ${allowJoining ? styles.view : styles.delete}`}
            onClick={handleToggleJoining}
          >
            {allowJoining ? 'Allow Joining: On' : 'Allow Joining: Off'}
          </button>
        )}
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
          {userData.map((user) => (
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
                  {head === 'true' && sessionStorage.getItem('email')!==user.email && (
                    <button className={`${styles.button} ${styles.delete}`} onClick={() => handleDeleteUser(user.email)}>
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
