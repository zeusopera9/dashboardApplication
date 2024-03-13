"use client"
import styles from '@/app/ui/dashboard/family/addUser/addUser.module.css'
import { addDoc, collection } from 'firebase/firestore'
import { useState } from 'react';
import { db } from '@/app/firebase/config';

async function addUserToFamily(firstName,lastName,username,email,password,familyCode){
  try{
    const docRef = await addDoc(collection(db,"User"),{
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      username: username,
      familyCode: familyCode,
      head: false,
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  }catch(error){
    console.error("Error adding document: ", error);
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

  const handleSubmit = async(event) =>{
    event.preventDefault();
    const added = await addUserToFamily(firstName,lastName,username,email,password,familyCode);
    if(added){
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setUsername("");
      setFamilyCode("");

      alert("Data added to firestore");
    }
    else{
      console.log("Boo you fail");
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