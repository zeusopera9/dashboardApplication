import CardDay from "../ui/dashboard/cards/cardDay"
import CardWeek from "../ui/dashboard/cards/cardWeek"
import CardMonth from "../ui/dashboard/cards/cardMonth"
import Transactions from "../ui/dashboard/transactions/transactions"
// import Rightbar from "../ui/dashboard/rightbar/rightbar"
import Chart from "../ui/dashboard/chart/chart"
import styles from "../ui/dashboard/dashboard.module.css"

const Dashboard = () => {
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
      {/* <div className={styles.side}>
        <Rightbar/>
      </div> */}
    </div>
  )
}

export default Dashboard