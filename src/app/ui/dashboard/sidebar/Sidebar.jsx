import React from 'react'
import styles from "./sidebar.module.css"
import { MdAnalytics, MdAttachMoney, MdDashboard, MdHelpCenter, MdLogout, MdOutlineSettings, MdSupervisedUserCircle, MdWork } from 'react-icons/md'
import { GiFamilyHouse } from "react-icons/gi";
import MenuLink from './menuLink/menuLink'
import Image from 'next/image';

const sidebarItems = [
  {
    title: "Pages",
    list:[
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard/>
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle/>
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
        title: "Revenue",
        path: "/dashboard/revenue",
        icon: <MdWork/>
      },
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: <MdAnalytics/>
      },
      {
        title: "Family",
        path: "/dashboard/family",
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
]

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image className={styles.userImage} src="/noavatar.png" alt="" width="50" height="50"/>
        <div className={styles.userDetail}>
          <span className={styles.username}>Yakshit Poojary</span>
          <span className={styles.userTitle}>Servicing The Micro</span>
        </div>
      </div>

      <ul className={styles.list}>
        {sidebarItems.map(cat=>(
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map(item=>(
              <MenuLink item={item} key={item.title}/>
            ))}
          </li>
        ))}
      </ul>
      <button className={styles.logout}>
        <MdLogout/>
        Log Out
        </button>
    </div>
  )
}

export default Sidebar