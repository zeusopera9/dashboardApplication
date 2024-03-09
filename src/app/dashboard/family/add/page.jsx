import styles from '@/app/ui/dashboard/users/addUser/addUser.module.css'

const AddUser = () => {
  return (
    <div className={styles.container}>
      <form action="" className={styles.form}>
        <input type="text" placeholder='First Name' name='firstName' required/>
        <input type="text" placeholder='Last Name' name='lastName' required/>
        <input type="text" placeholder='Username' name='username' required/>
        <input type="email" placeholder='Email' name='email' required/>
        <input type="password" placeholder='Password' name='password' required/>
        <input type="password" placeholder='Family Code' name='familyCode' required/>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AddUser