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

async function checkHead(familyCode){
  try{
    const userDocs = await getDocs(collection(db,'User'));

    for(const userDoc of userDocs.docs){
      const userData = userDoc.data();
      if(userData.familyCode == familyCode){
        return false
      }
    }
    return true;
  }catch(error){
    console.error("Error checking for head", error);
    return false
  }
}

const AddUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  const handleSubmit = async(event) =>{
    event.preventDefault();
    const head = await checkHead(familyCode);
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
      console.log("Boo you fail");
    }
  }

  // const [user] = useAuthState(auth);
  // useEffect(()=>{
  //   if(user){
  //     router.push("/");
  //   }
  // },[user]);

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
        <input type="password" placeholder='Family Code' name='familyCode' required
          value={familyCode}
          onChange={(e)=>setFamilyCode(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AddUser