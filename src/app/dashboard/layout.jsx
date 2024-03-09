import React from 'react'
import Sidebar from "../ui/dashboard/sidebar/Sidebar"
import Navbar from "../ui/dashboard/navbar/Navbar"
import Footer from "../ui/dashboard/footer/Footer"
import styles from "../ui/dashboard/dashboard.module.css"

const Layout = ({children}) => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar/>
        </div>
        <div className={styles.content}>
            <Navbar/>
            {children}
            <Footer/>
        </div>
    </div>
  )
}

export default Layout