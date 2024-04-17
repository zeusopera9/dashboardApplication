import React from 'react'
import PieChart from '../../ui/dashboard/chart/pieChart'
import BarChart from '../../ui/dashboard/chart/barChart'
import styles from '../../ui/dashboard/reports/reports.module.css'

const ReportsPage = () => {
  return (
    <div>
      <div className={styles.charts}>
          <PieChart/>
          <BarChart/>
      </div>
      
    </div>
  )
}

export default ReportsPage