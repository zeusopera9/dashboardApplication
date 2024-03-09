"use client"
import styles from '@/app/ui/login/login.module.css';
import {useState} from 'react';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {auth} from '@/app/firebase/config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleLogin = async (event) => {
    event.preventDefault();
    try{
      const res = await createUserWithEmailAndPassword(email,password);
      console.log({res});
      setEmail('');
      setPassword('');
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h1 className={styles.title}>Sign In With your Account</h1>
        <input 
          type="text" 
          name="email" 
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="password" 
          name="password" 
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginPage;
