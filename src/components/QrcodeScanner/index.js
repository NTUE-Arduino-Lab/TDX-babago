import React from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

// import path from '../../router/path';
import styles from './styles.module.scss';
import Step2 from '../../asset/imgs/Step2.svg';
import Step3 from '../../asset/imgs/Step3.svg';

function QrcodeScanner() {
  const navigate = useNavigate();
  return (
    <div className={styles.sidebar_box}>
      <BarcodeScannerComponent
        width={'100%'}
        height={'100%'}
        onUpdate={(err, result) => {
          if (result) {
            navigate(result.text);
          } else {
            console.log('Not Found');
          }
        }}
      />
      <div className={styles.infoBox}>
        <div className={styles.infoBox_title}>三步驟預約上車</div>
        <div className={styles.infoBox_content}>
          <div>1.</div>掃描公車站牌上含有巴巴走標示的QR Code
        </div>
        <img src={Step2} />
        <div className={styles.infoBox_content}>
          <div>2.</div>選擇想要預約的路線
        </div>
        <div className={styles.infoBox_content}>
          <div>3.</div>點擊預約上車
        </div>
        <img src={Step3} />
      </div>
    </div>
  );
}

export default QrcodeScanner;
