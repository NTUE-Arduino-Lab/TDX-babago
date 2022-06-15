import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

// import path from '../../router/path';
import styles from './styles.module.scss';

function QrcodeScanner() {
  const navigate = useNavigate();
  const [qrdata, setQrData] = useState('No result');
  return (
    <div className={styles.sidebar_box}>
      <BarcodeScannerComponent
        width={'100%'}
        height={'100%'}
        onUpdate={(err, result) => {
          if (result) {
            setQrData(result.text);
            navigate(result.text);
          } else {
            setQrData('Not Found');
          }
        }}
      />
      <p>{qrdata}</p>
    </div>
  );
}

export default QrcodeScanner;
