import React, { useEffect, useContext } from 'react';
import styles from './styles.module.scss';

import { setReserveBus } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faFlag, faUser } from '@fortawesome/free-solid-svg-icons';

function ReserveBox() {
  const {
    state: {
      reserveBus,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {}, [reserveBus]);

  return (
    <div className={styles.sidebar_box}>
      {reserveBus ? (
        <>
          {reserveBus.stationID.stationID ? (
            <div className={`${styles.reserveBox}`}>
              <div
                className={`${styles.reserveBox_routeInfoBox} ${styles.box__spaceBetween} ${styles.box__alignItemsCenter}`}
              >
                <div>
                  <div className={styles.routeInfoBox_routeName}>
                    {reserveBus.currentRoutesBus.routeName}
                  </div>
                  <div className={styles.routeInfoBox_routeDirection}>
                    {reserveBus.currentRoutesBus.direction == 225
                      ? ''
                      : reserveBus.currentRoutesBus.direction == 2
                      ? '環形'
                      : reserveBus.currentRoutesBus.direction == 1
                      ? `往${reserveBus.certainRoute.departureStopNameZh}`
                      : `往${reserveBus.certainRoute.destinationStopNameZh}`}
                  </div>
                </div>
                <div
                  className={`${styles.routeInfoBox_routeTimeBox} ${styles.box__flex}`}
                >
                  <div className={styles.routeTimeBox_Time}>{/* 20 */}</div>
                  <div className={styles.routeTimeBox_Minute}>
                    {reserveBus.currentRoutesBus.stopStatus}
                  </div>
                </div>
              </div>
              <div
                className={`${styles.routeInfoBox_stopName} ${styles.box__flex} ${styles.box__alignItemsCenter}`}
              >
                <FontAwesomeIcon icon={faFlag} />
                <div>{reserveBus.stationID.stationName}</div>
              </div>
              <div className={styles.box__end}>
                <button
                  className={`${styles.buttonBox_button} ${styles.button_cancel} ${styles.box__alignItemsCenter} ${styles.box__center}`}
                  onClick={() => {
                    setReserveBus(dispatch, {
                      buses: null,
                    });
                  }}
                >
                  取消預約
                </button>
                <div
                  className={`${styles.buttonBox_button} ${styles.button_help} ${styles.box__alignItemsCenter} ${styles.box__center} `}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <div>司機協助</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.reserveBox}`}>
              <div
                className={`${styles.reserveBox_routeInfoBox} ${styles.box__spaceBetween} ${styles.box__alignItemsCenter}`}
              >
                <div>
                  <div className={styles.routeInfoBox_StopName}>
                    {reserveBus.stationID.stationName}
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
                <div>
                  {reserveBus.currentRoutesBus.direction == 225
                    ? reserveBus.currentRoutesBus.routeName
                    : reserveBus.currentRoutesBus.direction == 2
                    ? `${reserveBus.currentRoutesBus.routeName} - 環形`
                    : reserveBus.currentRoutesBus.direction == 1
                    ? `${reserveBus.currentRoutesBus.routeName} - 往${reserveBus.certainRoute.departureStopNameZh}`
                    : `${reserveBus.currentRoutesBus.routeName} - 往${reserveBus.certainRoute.destinationStopNameZh}`}
                </div>
              </div>
              <div
                className={`${styles.routeInfoBox_stopName} ${styles.box__flex} ${styles.box__alignItemsCenter}`}
              >
                <FontAwesomeIcon icon={faFlag} />
                <div className={styles.stopName_name}>
                  目前：文山運動中心(興隆)
                </div>
                <div className={styles.stopName_number}>19站</div>
              </div>
              <div className={styles.box__end}>
                <button
                  className={`${styles.buttonBox_button} ${styles.button_cancel} ${styles.box__alignItemsCenter} ${styles.box__center}`}
                  onClick={() => {
                    setReserveBus(dispatch, {
                      buses: null,
                    });
                  }}
                >
                  取消預約
                </button>
                <div
                  className={`${styles.buttonBox_button} ${styles.button_help} ${styles.box__alignItemsCenter} ${styles.box__center} `}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <div>司機協助</div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ReserveBox;
