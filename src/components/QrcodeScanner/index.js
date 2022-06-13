import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

import path from '../../router/path';
import styles from './styles.module.scss';

function QrcodeScanner() {
  const navigate = useNavigate();
  const [data, setData] = useState('No result');
  return (
    <div className={styles.sidebar_box}>
      <QrReader
        onResult={(result, error) => {
          if (result !== undefined) {
            setData(result?.text);
            navigate(path.certainStop);
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
