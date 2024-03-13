"use client"
import CardDay from "../ui/dashboard/cards/cardDay"
import CardWeek from "../ui/dashboard/cards/cardWeek"
import CardMonth from "../ui/dashboard/cards/cardMonth"
import Transactions from "../ui/dashboard/transactions/transactions"
import Chart from "../ui/dashboard/chart/chart"
import styles from "../ui/dashboard/dashboard.module.css"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/app/firebase/config"
import { useRouter } from "next/navigation"

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');
  if(user){
    sessionStorage.setItem('uid',user.uid)
  }
  
  if(!user && !userSession){
    router.push('/login');
    return null; 
  }

  console.log(sessionStorage.getItem('uid'));

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <CardDay/>
          <CardWeek/>
          <CardMonth/>
        </div>
        <Transactions/>
        <Chart/>
      </div>  
    </div>
  )
}

export default Dashboard
