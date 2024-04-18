"use client"
import CardDay from "../ui/dashboard/cards/cardDay"
import CardWeek from "../ui/dashboard/cards/cardWeek"
import CardMonth from "../ui/dashboard/cards/cardMonth"
import Transactions from "../ui/dashboard/transactions/transactions"
import Chart from "../ui/dashboard/chart/chart"
import styles from "../ui/dashboard/dashboard.module.css"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/app/firebase/config"
import { db } from "@/app/firebase/config";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { useRouter } from "next/navigation"
import { useEffect } from "react"

async function fetchUserData(uid,router) {
  try {
    const userDoc = await getDoc(doc(db, "User", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      sessionStorage.setItem('uid',uid);
      sessionStorage.setItem('email', userData.email);
      sessionStorage.setItem('familyCode', userData.familyCode);
      sessionStorage.setItem('firstName', userData.firstName);
      sessionStorage.setItem('head', userData.head);
      sessionStorage.setItem('lastName', userData.lastName);
      sessionStorage.setItem('username', userData.username);
    }
    else{
      router.push("/addDetails")
    }
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
  }
}

async function fetchFamilyToggle(familyCode){
  try{
    const codeDoc = await getDoc(doc(db,"FamilyCodes",familyCode));
    if(codeDoc.exists()){
      const codeData = codeDoc.data();
      sessionStorage.setItem("allowJoining",codeData.allowJoining);
    }
    else{
      router.push("/addDetails")
    }
  }catch(error){
    console.error("Error fetching toggle mode: ", error)
  }
}


const Dashboard = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('uid', user.uid);
      fetchUserData(user.uid,router);
      fetchFamilyToggle(sessionStorage.getItem('familyCode'))
    }
    else if(!user && !sessionStorage.getItem('user')) {
      router.push('/login');
    }
  }, [user]);


  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <CardDay />
          <CardWeek />
          <CardMonth />
        </div>
        <Transactions />
        <Chart/>
      </div>
    </div>
  )
}

export default Dashboard
