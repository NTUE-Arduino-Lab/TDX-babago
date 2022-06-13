import React from 'react';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

function ScanBox() {
  return (
    <div className={styles.sidebar_box}>
      <Link
        to={path.scanQrcode}
        className={`${styles.reserveBox} ${styles.box__alignItemsCenter} ${styles.box__center}`}
      >
        <FontAwesomeIcon className={styles.box__icon} icon={faQrcode} />
        <div className={styles.box__word}>掃描預約</div>
      </Link>
    </div>
  );
}

export default ScanBox;
