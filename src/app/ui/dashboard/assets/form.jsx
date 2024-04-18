import React, { useState } from 'react';
import styles from './assetForm.module.css';
import { auth, db } from '@/app/firebase/config';
import { setDoc, collection, getDocs, getDoc, doc, addDoc } from 'firebase/firestore'


async function addAssets(assetName, assetValue, assetType) {
  try {
    const assetCollectionRef = collection(db, 'Assets');
    await addDoc(assetCollectionRef, {
      familyCode: sessionStorage.getItem('familyCode'),
      name: assetName,
      type: assetType,
      value: assetValue,
      uid: sessionStorage.getItem('uid')
    });
    return true; 
  } catch (error) {
    console.error('Error adding assets: ', error);
    return false;
  }
}


const AssetForm = () => {
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState();
  const [assetType, setAssetType] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const numericAssetValue = parseFloat(assetValue);
    const added = await addAssets(assetName, numericAssetValue, assetType);
    if (added) {
      alert('Asset Added');
      setAssetName('');
      setAssetValue('');
      setAssetType('');
    } else {
      alert('Failed to add asset');
      setAssetName('');
      setAssetValue('');
      setAssetType('');
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTextHeader}>Asset Form</h2>
        <form onSubmit={handleSubmit} >
          <div> 
            <label htmlFor="assetName" className={styles.formLabel}>
              Asset Name:
            </label>
            <input
              type="text"
              id="assetName"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div>
            <label htmlFor="assetValue" className={styles.formLabel}>Asset Value ($):</label>
            <input
              type="number"
              id="assetValue"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div>
            <label htmlFor="assetType" className={styles.formLabel}>Asset Type:</label>
            <select
              id="assetType"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className={styles.formSelect}
              required
            >
              <option value="">Select</option>
              <option value="Savings Account">Savings Account</option>
              <option value="Stocks">Stocks</option>
              <option value="Real Estate">Real Estate</option>
            </select>
          </div>
          <button type="submit" className={styles.formButton}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
