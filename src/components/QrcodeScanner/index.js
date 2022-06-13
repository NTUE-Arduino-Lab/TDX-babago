import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { QrReader } from 'react-qr-reader';

function QrcodeScanner() {
  const navigate = useNavigate();
  const [data, setData] = useState('No result');
  return (
    <div className={styles.sidebar_box}>
      <QrReader
        onResult={(result, error) => {
          if (result !== undefined) {
            setData(result?.text);
            navigate(result?.text);
          }

          if (error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
    </div>
  );
}

export default QrcodeScanner;
