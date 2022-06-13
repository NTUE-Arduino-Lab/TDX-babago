import React, { useEffect, useContext } from 'react';
import styles from './styles.module.scss';

import { setRemindBuses } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

function RemindBox() {
  const {
    state: {
      remindBuses,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {}, [remindBuses.length]);

  return (
    <div className={styles.sidebar_box}>
      {remindBuses && remindBuses.length > 0 ? (
        <>
          {remindBuses.map((bus, index) => (
            <div className={`${styles.reserveBox}`} key={index}>
              <div
                className={`${styles.reserveBox_routeInfoBox} ${styles.box__spaceBetween} ${styles.box__alignItemsCenter}`}
              >
                <div>
                  <div className={styles.routeInfoBox_routeName}>
                    {bus.currentRoutesBus.routeName}
                  </div>
                  <div className={styles.routeInfoBox_routeDirection}>
                    {bus.currentRoutesBus.direction == 225
                      ? ''
                      : bus.currentRoutesBus.direction == 2
                      ? '環形'
                      : bus.currentRoutesBus.direction == 1
                      ? `往${bus.certainRoute.departureStopNameZh}`
                      : `往${bus.certainRoute.destinationStopNameZh}`}
                  </div>
                </div>
                <div
                  className={`${styles.routeInfoBox_routeTimeBox} ${styles.box__flex}`}
                >
                  <div className={styles.routeTimeBox_Time}>{/* 20 */}</div>
                  <div className={styles.routeTimeBox_Minute}>
                    {bus.currentRoutesBus.stopStatus}
                  </div>
                </div>
              </div>
              <div
                className={`${styles.routeInfoBox_stopName} ${styles.box__flex} ${styles.box__alignItemsCenter}`}
              >
                <FontAwesomeIcon icon={faFlag} />
                <div>{bus.stationID.stationName}</div>
              </div>
              <div className={styles.box__end}>
                <button
                  className={`${styles.buttonBox_button} ${styles.button_cancel} ${styles.box__alignItemsCenter} ${styles.box__center}`}
                  onClick={() => {
                    let busesArr = remindBuses;
                    busesArr.splice(index, 1);
                    setRemindBuses(dispatch, {
                      buses: busesArr,
                    });
                  }}
                >
                  取消提醒
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default RemindBox;
