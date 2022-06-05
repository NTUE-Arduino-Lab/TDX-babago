import React from 'react';
import styles from './styles.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

function ScanBox() {
  return (
    <div className={styles.sidebar_box}>
      <div
        className={`${styles.reserveBox} ${styles.box__alignItemsCenter} ${styles.box__center}`}
      >
        <FontAwesomeIcon className={styles.box__icon} icon={faQrcode} />
        <div className={styles.box__word}>掃描預約</div>
      </div>
    </div>
  );
}

export default ScanBox;
