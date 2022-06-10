import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import { setNearbyStops, setSelectStopIndex } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function NearbyStopsBox() {
  const {
    state: {
      position,
      nearbyStops,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    if (position) {
      setNearbyStops(dispatch, { lng: position.lng, lat: position.lat });
    }
  }, [position]);

  useEffect(() => {}, [nearbyStops]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      <div
        className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.nearbyBox_titleBox}`}
      >
        附近站牌
      </div>
      {nearbyStops ? (
        <>
          {nearbyStops.map((nearbyStop, index) => (
            <div className={styles.nearbyBox_certainStopBox} key={index}>
              <Link
                to={`${path.certainStop}?clickStopIndex=${index}`}
                className={styles.certainStopBox_linkSetting}
                onClick={() => setSelectStopIndex(dispatch, { index: index })}
              >
                <div className={styles.certainStopBox_frontBox}>
                  <div
                    className={`${styles.routeStopBox_stopInfoBox} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
                  >
                    <div className={styles.stopInfoBox_stopName__fontSize}>
                      {nearbyStop.stationName}
                    </div>
                    <div className={styles.stopInfoBox_stopDistance__fontSize}>
                      {nearbyStop.stationDistance} 公尺
                    </div>
                  </div>
                  <div
                    className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
                  >
                    <div className={styles.routeStopBox_routeNameBox}>
                      {nearbyStop.routes.map((routeName, index) => (
                        <div key={index}>
                          <div
                            className={`${styles.routeNameBox_routeName} ${styles.linkRow__fontSize} ${styles.box__alignItemsCenter}`}
                          >
                            {routeName}
                          </div>
                        </div>
                      ))}
                    </div>
                    <FontAwesomeIcon
                      className={styles.linkRow_arrowIcon}
                      icon={faArrowRight}
                    />
                  </div>
                </div>
                <div className={styles.certainStopBox_shadow}></div>
              </Link>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
    //   )}
    // </>
  );
}

export default NearbyStopsBox;
