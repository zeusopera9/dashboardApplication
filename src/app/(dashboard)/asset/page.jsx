"use client"

import React, { useState } from 'react';
import AssetForm from '../../ui/dashboard/assets/form';
import ViewAssets from '../../ui/dashboard/assets/ViewAssets';
import styles from '../../ui/dashboard/assets/assetPage.module.css';


const page = () => {
  const [showViewAsset, setShowViewAsset] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleViewAssetClick = () => {
    setShowViewAsset(true);
    setShowForm(false);
  };

  const handleAddAssetClick = () => {
    setShowViewAsset(false);
    setShowForm(true);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          Monitor your Assets
        </div>
        
        <div className={styles.rightHeader}>
          <button className={styles.optionButton}>Add an Asset</button>
          <button className={styles.optionButton}>View Assets</button>
        </div>
      </div>
      <div>
        <ViewAssets />  
      </div>
      {/* <AssetForm /> */}
    </div>
  )
}

export default page
