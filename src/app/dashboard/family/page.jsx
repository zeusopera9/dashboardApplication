import styles from "../../ui/dashboard/users/users.module.css"
import Search from '../../ui/dashboard/search/Search'
import Link from 'next/link'

const UsersPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder={"Search for a user"}/>
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add New Member</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Surname</td>
            <td>Username</td>
            <td>Email</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Yakshit</td>
            <td>Poojary</td>
            <td>yakshit</td>
            <td>yakshit@gmail.com</td>
            <td>
              <div className={styles.buttons}>
                <Link href="/">
                  <button className={`${styles.button} ${styles.view}`}>View</button>
                </Link>
                  <button className={`${styles.button} ${styles.delete}`}>Delete</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Zaidali</td>
            <td>Merchant</td>
            <td>zaid</td>
            <td>zaid@gmail.com</td>
            <td>
              <div className={styles.buttons}>
                <Link href="/">
                  <button className={`${styles.button} ${styles.view}`}>View</button>
                </Link>
                  <button className={`${styles.button} ${styles.delete}`}>Delete</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Shubraja</td>
            <td>Lalith</td>
            <td>shubja</td>
            <td>shubraja@gmail.com</td>
            <td>
              <div className={styles.buttons}>
                <Link href="/">
                  <button className={`${styles.button} ${styles.view}`}>View</button>
                </Link>
                  <button className={`${styles.button} ${styles.delete}`}>Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage