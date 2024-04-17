import React from 'react'
import PieChart from '../../ui/dashboard/chart/pieChart'
import BarChart from '../../ui/dashboard/chart/barChart'
import LineChart from '../../ui/dashboard/chart/lineChart'
import styles from '../../ui/dashboard/reports/reports.module.css'

const ReportsPage = () => {
  return (
    <div>
      <div className={styles.charts}>
          <PieChart/>
          <BarChart/>
      </div>
      <LineChart/>
    </div>
  )
}

export default ReportsPage