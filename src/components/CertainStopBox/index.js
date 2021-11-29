import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import { setNearbyStops, setCertainRoutes } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function CertainStopBox() {
  const reactlocation = useLocation();
  var { clickStopIndex } = reactlocation.state;
  const [certainStop, setCertainStop] = useState(null);
  const [changeLocation, setChangeLocation] = useState(null);
  const {
    state: { position, location, nearbyStops, certainRoutes },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    // console.log('certainPage: ' + clickStopIndex);
    if (changeLocation === null) {
      setChangeLocation(false);
    } else {
      clickStopIndex = 0;
      setChangeLocation(true);
      if (position) {
        setNearbyStops(dispatch, { lng: position.lng, lat: position.lat });
      }
    }
  }, [location]);

  useEffect(() => {
    if (nearbyStops && nearbyStops.length > clickStopIndex) {
      setCertainStop(nearbyStops[clickStopIndex]);
    }
  }, [nearbyStops, clickStopIndex]);

  useEffect(() => {
    if (location && certainStop) {
      setCertainRoutes(dispatch, {
        city: location.city,
        stationID: certainStop.stationID,
      });
    }
  }, [location, certainStop]);

  useEffect(() => {}, [certainRoutes]);

  return (
    <div className={styles.sidebar_box}>
      <div className={styles.certainStopBox_titlebox__marginBottom}>
        {nearbyStops && nearbyStops[clickStopIndex] && location ? (
          <>
            <div
              className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.certainStopBox_stopName}`}
            >
              {nearbyStops[clickStopIndex].stationName}
            </div>
            <div
              className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.certainStopBox_stopInfo}`}
            >
              <div className={styles.stopInfo_detailBox}>
                <div>{location.city}</div>
                <div>{location.town}</div>
                <div>{nearbyStops[clickStopIndex].stationDistance} 公尺</div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {certainRoutes ? (
        <>
          {certainRoutes.map((certainRoute, index) => (
            <div className={styles.certainStopBox_certainRouteBox} key={index}>
              <Link
                to={path.certainRoute}
                className={styles.certainRouteBox_linkSetting}
                state={{ clickRouteName: certainRoute.routeName }}
              >
                <div
                  className={`${styles.certainRouteBox_frontBox} ${styles.box__alignItemsCenter}`}
                  key={index}
                >
                  <div className={styles.certainRouteBox_routeName}>
                    {certainRoute.routeName}
                  </div>
                  <div className={styles.certainRouteBox_routeDirection}>
                    {certainRoute.routeID}
                  </div>
                  <div
                    className={
                      certainRoute.stopStatus === '進站中'
                        ? `${styles.certainRouteBox_routeState} ${styles.routeState__textGreen}`
                        : certainRoute.stopStatus === '尚未發車' ||
                          certainRoute.stopStatus === '交管不停靠' ||
                          certainRoute.stopStatus === '末班車已過' ||
                          certainRoute.stopStatus === '今日未營運'
                        ? `${styles.certainRouteBox_routeState} ${styles.routeState__textPink}`
                        : `${styles.certainRouteBox_routeState} ${styles.routeState__textDark}`
                    }
                  >
                    {certainRoute.stopStatus}
                  </div>
                  <FontAwesomeIcon
                    className={styles.certainRouteBox_arrowIcon}
                    icon={faArrowRight}
                  />
                </div>
                <div className={styles.certainRouteBox_shadow}></div>
              </Link>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default CertainStopBox;
