"use client"
import styles from '@/app/ui/dashboard/family/addUser/addUser.module.css'
import { setDoc, collection, getDocs, getDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { db,auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from "react-firebase-hooks/auth"

async function addUserToFamily(firstName,lastName,username,email,password,familyCode,head){
  try {
    const userDocRef = doc(db, 'User', sessionStorage.getItem('uid'));
    await setDoc(userDocRef, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      username: username,
      familyCode: familyCode,
      head: head,
    });
    console.log("Document written with ID: ", sessionStorage.getItem('uid'));
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

async function checkJoining(head, familyCode, setHead) {
  try {
    const codeDocRef = doc(db, 'FamilyCodes', familyCode);
    const codeDoc = await getDoc(codeDocRef);
    
    if (codeDoc.exists()) {
      setHead(false);
      if (codeDoc.data().allowJoining) {
        return true;
      } else {
        return false;
      }
    } else {
      setHead(true);
      await setDoc(codeDocRef, { allowJoining: true });
      console.log("Added code to FamilyCodes: ", familyCode);
      return true;
    }
  } catch (error) {
    console.error("Error checking for joining and head", error);
    return false;
  }
}


const AddUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [username, setUsername] = useState("");
  const [head,setHead] = useState(false);

  const router = useRouter();

  const handleSubmit = async(event) =>{
    event.preventDefault();
    const allow = await checkJoining(head,familyCode, setHead);
    if(allow){
      const added = await addUserToFamily(firstName,lastName,username,email,password,familyCode,head);
      if(added){
        alert("Data added to firestore");
        router.push("/");
      }
      else{
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setUsername("");
        setFamilyCode("");
      }
    }
    else{
      alert("Please Contact Your Family Head to turn on joining")
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder='First Name' name='firstName' required
          value={firstName}
          onChange={(e)=>setFirstName(e.target.value)}
        />
        <input type="text" placeholder='Last Name' name='lastName' required
          value={lastName}
          onChange={(e)=>setLastName(e.target.value)}
        />
        <input type="text" placeholder='Username' name='username' required
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <input type="email" placeholder='Email' name='email' required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input type="password" placeholder='Password' name='password' required
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <input type="text" placeholder='Family Code' name='familyCode' required
          value={familyCode}
          onChange={(e)=>setFamilyCode(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AddUser