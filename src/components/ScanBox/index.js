import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

function ScanBox() {
  const reactlocation = useLocation();
  const { lng, lat } = QueryString.parse(reactlocation.search);

  const {
    state: { reserveBus },
  } = useContext(StoreContext);
  return (
    <>
      {!reserveBus ? (
        <div className={styles.sidebar_box}>
          <Link
            to={`${path.scanQrcode}?lng=${lng}&lat=${lat}`}
            className={`${styles.reserveBox} ${styles.box__alignItemsCenter} ${styles.box__center}`}
          >
            <FontAwesomeIcon className={styles.box__icon} icon={faQrcode} />
            <div className={styles.box__word}>掃描預約</div>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ScanBox;
