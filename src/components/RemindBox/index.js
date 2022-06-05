import React from 'react';
import styles from './styles.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

function RemindBox() {
  return (
    <div className={styles.sidebar_box}>
      <div className={`${styles.reserveBox}`}>
        <div
          className={`${styles.reserveBox_routeInfoBox} ${styles.box__spaceBetween} ${styles.box__alignItemsCenter}`}
        >
          <div>
            <div className={styles.routeInfoBox_routeName}>278</div>
            <div className={styles.routeInfoBox_routeDirection}>
              往景美捷運站
            </div>
          </div>
          <div
            className={`${styles.routeInfoBox_routeTimeBox} ${styles.box__flex}`}
          >
            <div className={styles.routeTimeBox_Time}>20</div>
            <div className={styles.routeTimeBox_Minute}>分</div>
          </div>
        </div>
        <div
          className={`${styles.routeInfoBox_stopName} ${styles.box__flex} ${styles.box__alignItemsCenter}`}
        >
          <FontAwesomeIcon icon={faFlag} />
          <div>國立台北教育大學</div>
        </div>
        <div className={styles.box__end}>
          <div
            className={`${styles.buttonBox_button} ${styles.button_cancel} ${styles.box__alignItemsCenter} ${styles.box__center}`}
          >
            取消提醒
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemindBox;
