import React from 'react';
import styles from './styles.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faFlag, faUser } from '@fortawesome/free-solid-svg-icons';

function ReserveOffBox() {
  return (
    <div className={styles.sidebar_box}>
      <div className={`${styles.reserveBox}`}>
        <div
          className={`${styles.reserveBox_routeInfoBox} ${styles.box__spaceBetween} ${styles.box__alignItemsCenter}`}
        >
          <div>
            <div className={styles.routeInfoBox_StopName}>
              捷運中正紀念堂站(羅斯福)
            </div>
          </div>
          <div
            className={`${styles.routeInfoBox_routeTimeBox} ${styles.box__flex}`}
          >
            <div className={styles.routeTimeBox_Time}>28</div>
            <div className={styles.routeTimeBox_Minute}>分</div>
          </div>
        </div>
        <div
          className={`${styles.routeInfoBox_busName} ${styles.box__flex} ${styles.box__alignItemsCenter}`}
        >
          <FontAwesomeIcon icon={faBus} />
          <div>羅斯福路幹線 - 往臺北車站</div>
        </div>
        <div
          className={`${styles.routeInfoBox_stopName} ${styles.box__flex} ${styles.box__alignItemsCenter}`}
        >
          <FontAwesomeIcon icon={faFlag} />
          <div className={styles.stopName_name}>目前：文山運動中心(興隆)</div>
          <div className={styles.stopName_number}>19站</div>
        </div>
        <div className={styles.box__end}>
          <div
            className={`${styles.buttonBox_button} ${styles.button_cancel} ${styles.box__alignItemsCenter} ${styles.box__center}`}
          >
            取消預約
          </div>
          <div
            className={`${styles.buttonBox_button} ${styles.button_help} ${styles.box__alignItemsCenter} ${styles.box__center} `}
          >
            <FontAwesomeIcon icon={faUser} />
            <div>司機協助</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReserveOffBox;
