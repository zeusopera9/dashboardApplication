import React, { useState } from 'react';
import styles from './assetForm.module.css';

import { auth, db } from '@/app/firebase/config';

const AssetForm = () => {
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetType, setAssetType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if(user) {
        const userId = user.uid;
        const assetData = { assetName, assetValue, assetType };

        await db.collection('users').doc(userId).collection('assets').add(assetData);

        console.log("Asset Added Successfully");

        setAssetName('');
        setAssetValue('');
        setAssetType('');
      } else {
        console.log("No user is signed in");
      }
    } catch(error) {
      console.log("Error Adding Asset: ", error);
    }
    console.log('Form submitted:', { assetName, assetValue, assetType });
    // Reset form fields
    setAssetName('');
    setAssetValue('');
    setAssetType('');
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
              {/* Add more options as needed */}
            </select>
          </div>
          <button type="submit" className={styles.formButton}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
