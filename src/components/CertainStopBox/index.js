import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import {
  setSelectRouteStopsSort,
  setSelectRouteStopsTime,
  setNearbyStops,
  setCurrentBuses,
  setCertainRoutes,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function CertainStopBox() {
  const reactlocation = useLocation();
  var { clickStopIndex } = QueryString.parse(reactlocation.search);
  const [certainStop, setCertainStop] = useState(null);
  const [changeLocation, setChangeLocation] = useState(null);
  const {
    state: {
      position,
      location,
      nearbyStops,
      currentBuses,
      certainRoutes,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    setSelectRouteStopsSort(dispatch, {
      city: '',
      selectRoute: '',
    });
    setSelectRouteStopsTime(dispatch, {
      city: '',
      selectRoute: '',
    });
  }, []);

  useEffect(() => {
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
    // console.log('certainPage: ' + clickStopIndex);
    if (nearbyStops && nearbyStops.length > clickStopIndex) {
      setCertainStop(nearbyStops[clickStopIndex]);
    }
  }, [nearbyStops, clickStopIndex]);

  useEffect(() => {
    if (location && certainStop) {
      setCurrentBuses(dispatch, {
        city: location.city,
        stationID: certainStop.stationID,
      });
    }
  }, [location, certainStop]);

  useEffect(() => {
    if (location && currentBuses) {
      setCertainRoutes(dispatch, {
        city: location.city,
        currentBuses: currentBuses,
      });
    }
  }, [currentBuses]);

  useEffect(() => {
    // console.log(certainRoutes);
  }, [certainRoutes]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      {nearbyStops && nearbyStops[clickStopIndex] && location ? (
        <div className={styles.certainStopBox_titlebox__marginBottom}>
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
        </div>
      ) : (
        <></>
      )}
      {currentBuses && certainRoutes ? (
        <>
          {currentBuses.map((currentRoutesBus, index) => (
            <div className={styles.certainStopBox_certainRouteBox} key={index}>
              <Link
                to={
                  certainRoutes[index]
                    ? `${path.certainRoute}?routeName=${currentRoutesBus.routeName}&routeUID=${currentRoutesBus.routeUID}&direction=${currentRoutesBus.direction}&departureStopNameZh=${certainRoutes[index].departureStopNameZh}&destinationStopNameZh=${certainRoutes[index].destinationStopNameZh}`
                    : ''
                }
                className={styles.certainRouteBox_linkSetting}
              >
                <div
                  className={`${styles.certainRouteBox_frontBox} ${styles.box__alignItemsCenter}`}
                  key={index}
                >
                  <div className={styles.certainRouteBox_routeName}>
                    {currentRoutesBus.routeName}
                  </div>
                  <div className={styles.certainRouteBox_routeDirection}>
                    {!certainRoutes[index] || currentRoutesBus.direction == 225
                      ? ''
                      : currentRoutesBus.direction == 2
                      ? '環形'
                      : currentRoutesBus.direction == 1
                      ? `往${certainRoutes[index].departureStopNameZh}`
                      : `往${certainRoutes[index].destinationStopNameZh}`}
                  </div>
                  <div
                    className={
                      currentRoutesBus.stopStatus === '進站中'
                        ? `${styles.certainRouteBox_routeState} ${styles.routeState__textGreen}`
                        : currentRoutesBus.stopStatus === '尚未發車' ||
                          currentRoutesBus.stopStatus === '交管不停靠' ||
                          currentRoutesBus.stopStatus === '末班車已過' ||
                          currentRoutesBus.stopStatus === '今日未營運'
                        ? `${styles.certainRouteBox_routeState} ${styles.routeState__textPink}`
                        : `${styles.certainRouteBox_routeState} ${styles.routeState__textDark}`
                    }
                  >
                    {currentRoutesBus.stopStatus}
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
    //   )}
    // </>
  );
}

export default CertainStopBox;
