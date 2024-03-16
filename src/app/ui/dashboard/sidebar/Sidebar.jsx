"use client"
import React, { useState, useEffect } from 'react';
import styles from "./sidebar.module.css";
import { MdAnalytics, MdAttachMoney, MdDashboard, MdHelpCenter, MdLogout, MdOutlineSettings } from 'react-icons/md';
import { GiFamilyHouse } from "react-icons/gi";
import MenuLink from './menuLink/menuLink';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const sidebarItems = [
  {
    title: "Pages",
    list:[
      {
        title: "Dashboard",
        path: "/",
        icon: <MdDashboard/>
      },
      {
        title: "Transactions",
        path: "/dashboard/transactions",
        icon: <MdAttachMoney/>
      },
    ],
  },
  {
    title: "Analytics",
    list:[
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: <MdAnalytics/>
      },
      {
        title: "Family",
        path: "/family",
        icon: <GiFamilyHouse />
      },
    ],
  },
  {
    title: "User",
    list:[
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings/>
      },
      {
        title: "Help",
        path: "/dashboard/help",
        icon: <MdHelpCenter/>
      },
    ],
  },
];


const Sidebar = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstName = sessionStorage.getItem('firstName');
        const lastName = sessionStorage.getItem('lastName');
        const familyCode = sessionStorage.getItem('familyCode');
        console.log(firstName);

        setUserData({ firstName, lastName, familyCode });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
    return () => {
    
    };
  }, []); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      {userData && (
        <div className={styles.user}>
          <div className={styles.userDetail}>
            <span className={styles.username}>{userData.firstName} {userData.lastName}</span>
            <span className={styles.userTitle}>Family Code: {userData.familyCode}</span>
          </div>
        </div>
      )}

      <ul className={styles.list}>
        {sidebarItems.map(cat => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map(item => (
              <MenuLink item={item} key={item.title}/>
            ))}
          </li>
        ))}
      </ul>
      <button className={styles.logout} onClick={handleLogout}>
        <MdLogout/>
        Log Out
      </button>
    </div>
  );
};

export default Sidebar;
