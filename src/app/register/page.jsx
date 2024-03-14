"use client"
import styles from '@/app/ui/signup/signup.module.css';
import {useState} from 'react';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {auth} from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    try{
      const res = await createUserWithEmailAndPassword(email,password);
      setEmail('');
      setPassword('');
      if(res){
        const uid = res.user.uid;
        sessionStorage.setItem('user', true);
        sessionStorage.setItem('uid', uid);
        router.push('/addDetails');
      }
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleRegister} className={styles.form}>
        <h1 className={styles.title}>Sign Up With your Account</h1>
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

        <button type='submit'>Register</button>
      </form>
    </div>
  )
}

export default LoginPage;
