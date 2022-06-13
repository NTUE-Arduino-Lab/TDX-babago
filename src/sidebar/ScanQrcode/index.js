import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import QrcodeScanner from '../../components/QrcodeScanner';

function ScanQrcode() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <QrcodeScanner></QrcodeScanner>
      </div>
    </Fragment>
  );
}

export default ScanQrcode;
