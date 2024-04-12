"use client"
import styles from '@/app/ui/signup/signup.module.css';
import {useEffect, useState} from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {auth} from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from "react-firebase-hooks/auth"
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);
  

  const handleLogin = async (event) => {
    event.preventDefault();
    try{
      const res = await signInWithEmailAndPassword(email,password);
      if(res){
        const uid = res.user.uid;
        sessionStorage.setItem('user', true);
        router.push("/");
      }
      else{
        setEmail('');
        setPassword('');
      }
    }catch(e){
      console.error("Login failed:", e.message);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h1 className={styles.title}>Login With your Account</h1>
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
        <span>Don't have an account? <Link href="/register" className={styles.registerLink}>Register Here</Link></span>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginPage;
