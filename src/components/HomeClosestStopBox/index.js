import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import {
  setCurrentBuses,
  setCertainRoutes,
  setSelectStopIndex,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line no-unused-vars
import { faArrowRight, faBell } from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';

function ClosestStopBox() {
  const [closestStop, setClosestStop] = useState(null);
  const [frontCertainRoutes, SetFrontCertainRoutes] = useState([]);
  const [currentRoutesBuses, SetCurrentRoutesBuses] = useState([]);
  // const [certainRoutesInfo, SetCertainRoutesInfo] = useState([]);
  const {
    state: { location, nearbyStops, currentBuses, certainRoutes },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    if (nearbyStops && nearbyStops.length > 0) {
      setClosestStop(nearbyStops[0]);
    }
  }, [nearbyStops]);

  useEffect(() => {
    if (location && closestStop) {
      setCurrentBuses(dispatch, {
        city: location.city,
        stationID: closestStop.stationID,
      });
    }
  }, [location, closestStop]);

  useEffect(() => {
    if (currentBuses) {
      if (currentBuses.length > 5) {
        const array = [];
        for (var i = 0; i < 5; i++) {
          array.push(currentBuses[i]);
        }
        SetCurrentRoutesBuses(array);
      } else {
        SetCurrentRoutesBuses(currentBuses);
      }
    }
  }, [currentBuses]);

  useEffect(() => {
    // let currentRoutesBusArray = [];

    // currentRoutesBus.map((bus) => {
    //   currentRoutesBusArray.push({
    //     routeName: bus.routeName,
    //   });
    // });
    // console.log(currentRoutesBusArray);

    // if (currentRoutesBusArray != frontCertainRoutes) {
    if (location && currentRoutesBuses.length > 0) {
      setCertainRoutes(dispatch, {
        city: location.city,
        currentBuses: currentRoutesBuses,
      });
    }
    // }
  }, [currentRoutesBuses]);

  useEffect(() => {
    if (certainRoutes) {
      SetFrontCertainRoutes(certainRoutes);
    }
  }, [certainRoutes]);

  useEffect(() => {}, [frontCertainRoutes]);

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
      {currentRoutesBuses && frontCertainRoutes ? (
        <>
          {currentRoutesBuses.map((currentRoutesBus, index) => (
            <div
              className={`${styles.closestBox_currentInfoBox} ${styles.box__alignItemsFlexStart}`}
              key={index}
            >
              <div className={`${styles.closestBox_flexBox}`}>
                <div className={styles.currentInfoBox_routeInfoBox}>
                  <div className={styles.routeInfoBox_routeName}>
                    {currentRoutesBus.routeName}
                  </div>
                  <div className={styles.routeInfoBox_routeDirection}>
                    {frontCertainRoutes[index] ||
                    currentRoutesBus.direction == 225
                      ? currentRoutesBus.direction == 1
                        ? `往${frontCertainRoutes[index].departureStopNameZh}`
                        : `往${frontCertainRoutes[index].destinationStopNameZh}`
                      : ''}
                  </div>
                </div>
                <div
                  className={
                    currentRoutesBus.stopStatus === '進站中'
                      ? `${styles.currentInfoBox_routeState} ${styles.routeState__textYellow}`
                      : currentRoutesBus.stopStatus === '尚未發車' ||
                        currentRoutesBus.stopStatus === '交管不停靠' ||
                        currentRoutesBus.stopStatus === '末班車已過' ||
                        currentRoutesBus.stopStatus === '今日未營運'
                      ? `${styles.currentInfoBox_routeState} ${styles.routeState__textGray}`
                      : `${styles.currentInfoBox_routeState} ${styles.routeState__textDark}`
                  }
                >
                  {currentRoutesBus.stopStatus}
                </div>
              </div>
              {/* 提醒按鈕區 */}
              <div className={styles.currentInfoBox_ButtonBox}>
                <div
                  className={`${styles.ButtonBox_Button} ${styles.ButtonBox_openButton} ${styles.box__alignItemsCenter} ${styles.box__spaceAruond}`}
                >
                  <FontAwesomeIcon
                    className={styles.ButtonBox_icon}
                    icon={farBell}
                  />
                  <div>開啟提醒</div>
                </div>
                {/* <div
                  className={`${styles.ButtonBox_Button} ${styles.ButtonBox_cancelButton} ${styles.box__alignItemsCenter} ${styles.box__spaceAruond}`}
                >
                  <FontAwesomeIcon
                    className={styles.ButtonBox_icon}
                    icon={faBell}
                  />
                  <div>取消提醒</div>
                </div> */}
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
