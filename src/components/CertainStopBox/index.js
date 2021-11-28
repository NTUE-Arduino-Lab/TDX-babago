import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
    console.log('certainPage: ' + clickStopIndex);
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
      <div
        className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.closestBox_titlebox__marginBottom}`}
      >
        <div className={styles.linkRow__fontSize}>最近站牌</div>
        <FontAwesomeIcon
          className={styles.linkRow_arrowIcon}
          icon={faArrowRight}
        />
      </div>
      <div
        className={`${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
      >
        {nearbyStops && nearbyStops[clickStopIndex] ? (
          <>
            <div className={styles.closestBox_stopName}>
              {nearbyStops[clickStopIndex].stationName}
            </div>
            <div className={styles.closestBox_stopDistance__fontSize}>
              {nearbyStops[clickStopIndex].stationDistance} 公尺
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {certainRoutes ? (
        <>
          {certainRoutes.map((certainRoute, index) => (
            <div
              className={`${styles.closestBox_currentInfoBox} ${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter}`}
              key={index}
            >
              <div className={styles.currentInfoBox_routeName}>
                {certainRoute.routeName}
              </div>
              <div className={styles.currentInfoBox_routeDirection}>
                {certainRoute.routeID}
              </div>
              <div className={styles.currentInfoBox_routeState}>
                {certainRoute.stopStatus}
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

export default CertainStopBox;
