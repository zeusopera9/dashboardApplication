"use client"
import React, { useState, useEffect } from 'react';
import styles from "./sidebar.module.css";
import { MdAnalytics, MdAttachMoney, MdDashboard, MdHelpCenter, MdLogout, MdOutlineSelfImprovement, MdOutlineSettings, MdChat } from 'react-icons/md';
import { GiFamilyHouse } from "react-icons/gi";
import MenuLink from './menuLink/menuLink';
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
        path: "/transactions",
        icon: <MdAttachMoney/>
      },
      {
        title: "Assets",
        path: "/asset",
        icon: <MdOutlineSelfImprovement />
      },
      {
        title: "Chat with AI",
        path: "/chat",
        icon: <MdChat />
      }
    ],
  },
  {
    title: "Analytics",
    list:[
      {
        title: "Reports",
        path: "/reports",
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
        path: "/settings",
        icon: <MdOutlineSettings/>
      },
      {
        title: "Help",
        path: "/help",
        icon: <MdHelpCenter/>
      },
    ],
  },
];


const Sidebar = ({userData}) => {
  const router = useRouter();
  
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
