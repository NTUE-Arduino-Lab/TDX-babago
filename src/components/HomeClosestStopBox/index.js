import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import { setCertainRoutes, setSelectStopIndex } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function ClosestStopBox() {
  const [closestStop, setClosestStop] = useState(null);
  const [frontCertainRoutes, SetFrontCertainRoutes] = useState([]);
  const {
    state: { location, nearbyStops, certainRoutes },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    if (nearbyStops && nearbyStops.length > 0) {
      setClosestStop(nearbyStops[0]);
    }
  }, [nearbyStops]);

  useEffect(() => {
    if (location && closestStop) {
      setCertainRoutes(dispatch, {
        city: location.city,
        stationID: closestStop.stationID,
      });
    }
  }, [location, closestStop]);

  useEffect(() => {
    if (certainRoutes) {
      if (certainRoutes.length > 5) {
        const array = [];
        for (var i = 0; i < 5; i++) {
          array.push(certainRoutes[i]);
        }
        SetFrontCertainRoutes(array);
      } else {
        SetFrontCertainRoutes(certainRoutes);
      }
    }
  }, [certainRoutes]);

  return (
    <div className={styles.sidebar_box}>
      <div
        className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.closestBox_titlebox__marginBottom}`}
      >
        <div className={styles.linkRow__fontSize}>最近站牌</div>
        <Link
          to={path.certainStop}
          state={{ clickStopIndex: 0 }}
          onClick={() => setSelectStopIndex(dispatch, { index: 0 })}
        >
          <FontAwesomeIcon
            className={styles.linkRow_arrowIcon}
            icon={faArrowRight}
          />
        </Link>
      </div>
      <div
        className={`${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
      >
        {nearbyStops && nearbyStops[0] ? (
          <>
            <div className={styles.closestBox_stopName}>
              {nearbyStops[0].stationName}
            </div>
            <div className={styles.closestBox_stopDistance__fontSize}>
              {nearbyStops[0].stationDistance} 公尺
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {certainRoutes ? (
        <>
          {frontCertainRoutes.map((certainRoute, index) => (
            <div
              className={`${styles.closestBox_currentInfoBox} ${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter}`}
              key={index}
            >
              <div className={styles.currentInfoBox_routeName}>
                {certainRoute.routeName}
              </div>
              <div
                className={
                  certainRoute.stopStatus === '進站中'
                    ? `${styles.currentInfoBox_routeState} ${styles.routeState__textYellow}`
                    : certainRoute.stopStatus === '尚未發車' ||
                      certainRoute.stopStatus === '交管不停靠' ||
                      certainRoute.stopStatus === '末班車已過' ||
                      certainRoute.stopStatus === '今日未營運'
                    ? `${styles.currentInfoBox_routeState} ${styles.routeState__textGray}`
                    : `${styles.currentInfoBox_routeState} ${styles.routeState__textDark}`
                }
              >
                {certainRoute.stopStatus}
              </div>
              <div className={styles.currentInfoBox_openButton}>開啟提醒</div>
              {/* 換行 */}
              <div className={styles.line_break}></div>
              <div className={styles.currentInfoBox_routeDirection}>
                {certainRoute.routeID}
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

export default ClosestStopBox;
