import React from 'react';
import styles from './styles.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function ReserveBox() {
  return (
    <div className={styles.sidebar_box}>
      <div
        className={` ${styles.box__spaceBetween} ${styles.box__alignItemsCenter}`}
      >
        <div>
          <div>278</div>
          <div>往景美捷運站</div>
        </div>
        <div className={` ${styles.box__flex}`}>
          <div>20</div>
          <div>分</div>
        </div>
      </div>

      <div className={` ${styles.box__flex}`}>
        <FontAwesomeIcon className={styles.button_icon} icon={faSearch} />
        <div>國立台北教育大學</div>
      </div>
      <div className={styles.box__end}>
        <div
          className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`}
        >
          取消預約
        </div>
        <div
          className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`}
        >
          <FontAwesomeIcon className={styles.button_icon} icon={faSearch} />
          <div>司機協助</div>
        </div>
      </div>
    </div>
  );
}

export default ReserveBox;
