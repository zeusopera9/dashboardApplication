import React, { useState } from 'react';
import styles from './assetForm.module.css';

const AssetForm = () => {
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetType, setAssetType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can submit the form data to Firebase
    console.log('Form submitted:', { assetName, assetValue, assetType });
    // Reset form fields
    setAssetName('');
    setAssetValue('');
    setAssetType('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Asset Information</h2>
        <form onSubmit={handleSubmit} >
          <div>
            <label htmlFor="assetName">Asset Name:</label>
            <input
              type="text"
              id="assetName"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="assetValue">Asset Value ($):</label>
            <input
              type="number"
              id="assetValue"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="assetType">Asset Type:</label>
            <select
              id="assetType"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Savings Account">Savings Account</option>
              <option value="Stocks">Stocks</option>
              <option value="Real Estate">Real Estate</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
