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
      <div className={styles.infoBox}>
        <div className={styles.infoBox_title}>三步驟預約上車</div>
        <ul>
          <li>掃描公車站牌上含有巴巴走標示的QR Code</li>
          <li>選擇想要預約的路線</li>
          <li>點擊預約上車</li>
        </ul>
      </div>
    </div>
  );
}

export default QrcodeScanner;
