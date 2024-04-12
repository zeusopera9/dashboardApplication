'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from "../ui/dashboard/sidebar/Sidebar"
import styles from "../ui/dashboard/dashboard.module.css"
import { useRouter } from 'next/navigation';

const Layout = ({children}) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    try {
      const firstName = sessionStorage.getItem('firstName');
      const lastName = sessionStorage.getItem('lastName');
      const familyCode = sessionStorage.getItem('familyCode');

      if (firstName && lastName && familyCode) {
        setUserData({ firstName, lastName, familyCode });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar userData={userData}/>
        </div>
        <div className={styles.content}>
            {children}
        </div>
    </div>
  )
}

export default Layout