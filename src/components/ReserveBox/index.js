import React, { useEffect, useContext, useState } from 'react';
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
  const [pageUpdate, setPageUpdate] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageUpdate(!pageUpdate);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [pageUpdate]);

  useEffect(() => {
    if (reserveBus && reserveBus.stationID) {
      setReserveBus(dispatch, {
        bus: reserveBus,
        update: true,
      });
    }
  }, [reserveBus, pageUpdate]);

  return (
    <>
      {reserveBus ? (
        <div className={styles.sidebar_box}>
          {reserveBus.stationID ? (
            <div className={`${styles.reserveBox}`}>
              <div
                className={`${styles.reserveBox_routeInfoBox} ${styles.box__spaceBetween} ${styles.box__alignItemsCenter}`}
              >
                <div>
                  <div className={styles.routeInfoBox_routeName}>
                    {reserveBus.routeName}
                  </div>
                  <div className={styles.routeInfoBox_routeDirection}>
                    {reserveBus.direction == 225
                      ? ''
                      : reserveBus.direction == 2
                      ? '環形'
                      : reserveBus.direction == 1
                      ? `往${reserveBus.departureStopNameZh}`
                      : `往${reserveBus.destinationStopNameZh}`}
                  </div>
                </div>
                <div
                  className={`${styles.routeInfoBox_routeTimeBox} ${styles.box__flex}`}
                >
                  <div className={styles.routeTimeBox_Time}>{/* 20 */}</div>
                  <div className={styles.routeTimeBox_Minute}>
                    {reserveBus.stopStatus}
                  </div>
                </div>
              </div>
              <div
                className={`${styles.routeInfoBox_stopName} ${styles.box__flex} ${styles.box__alignItemsCenter}`}
              >
                <FontAwesomeIcon icon={faFlag} />
                <div>{reserveBus.stationName}</div>
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
                  <div className={styles.routeInfoBox_StationName}>
                    {reserveBus.stationName}
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
                  {reserveBus.direction == 225
                    ? reserveBus.routeName
                    : reserveBus.direction == 2
                    ? `${reserveBus.routeName} - 環形`
                    : reserveBus.direction == 1
                    ? `${reserveBus.routeName} - 往${reserveBus.departureStopNameZh}`
                    : `${reserveBus.routeName} - 往${reserveBus.destinationStopNameZh}`}
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
                      bus: null,
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ReserveBox;
