import React, { useEffect, useContext, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';
import useDynamicRefs from 'use-dynamic-refs';

import path from '../../router/path';
import styles from './styles.module.scss';

import {
  setCurrentBuses,
  setCertainRoutes,
  setRemindBuses,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line no-unused-vars
import { faArrowRight, faBell } from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';

function ClosestStopBox() {
  const [getRef, setRef] = useDynamicRefs();
  const [overSize, setOverSize] = useState([]);
  const ClosestStop_ref = useRef(null);
  const ClosestStop_d_ref = useRef(null);
  const [ClosestStopWidth, setClosestStopWidth] = useState(0);
  const [ClosestStopDivWidth, setClosestStopDivWidth] = useState(0);

  const reactlocation = useLocation();
  const { lng, lat } = QueryString.parse(reactlocation.search);

  const {
    state: {
      nearbyStops,
      currentBuses,
      certainRoutes,
      remindBuses,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);
  const [closestStop, setClosestStop] = useState(null);
  const [currentRoutesBuses, setCurrentRoutesBuses] = useState(null);

  useEffect(() => {
    if (nearbyStops) {
      setClosestStop(nearbyStops[0].stationIDs[0]);
    }
  }, [nearbyStops]);

  useEffect(() => {
    if (closestStop) {
      setCurrentBuses(dispatch, {
        authorityCodes: closestStop.authorityCodes,
        stationID: closestStop.stationID,
      });

      if (
        ClosestStop_ref.current &&
        ClosestStop_ref.current.clientWidth &&
        ClosestStop_d_ref.current &&
        ClosestStop_d_ref.current.clientWidth
      ) {
        setClosestStopWidth(ClosestStop_ref.current.clientWidth);
        setClosestStopDivWidth(ClosestStop_d_ref.current.clientWidth);
      }
    }
  }, [closestStop]);

  useEffect(() => {
    if (currentBuses && closestStop) {
      let array = [];
      const currentBuses2 = [...currentBuses];

      if (currentBuses2.length > 5) {
        for (let i = 0; i < 5; i++) {
          array.push(currentBuses2[i]);
        }
      } else {
        array = currentBuses2;
      }

      if (array.length > 0) {
        const remindBusesArray = new Array(array.length).fill(false);
        for (let i = 0; i < remindBuses.length; i++) {
          if (remindBuses[i].stationID.stationID == closestStop.stationID) {
            for (let j = 0; j < array.length; j++) {
              if (
                remindBuses[i].currentRoutesBus.routeUID == array[j].routeUID &&
                remindBuses[i].currentRoutesBus.direction == array[j].direction
              ) {
                remindBusesArray[j] = true;
              }
            }
          }
        }
        for (let i = 0; i < array.length; i++) {
          array[i].remindState = remindBusesArray[i];
        }
      } else {
        for (let i = 0; i < array.length; i++) {
          array[i].remindState = false;
        }
      }
      setCurrentRoutesBuses(array);
    }
  }, [currentBuses, remindBuses.length]);

  useEffect(() => {
    if (currentRoutesBuses && currentRoutesBuses.length > 0) {
      setCertainRoutes(dispatch, {
        currentBuses: currentRoutesBuses,
      });
    }
  }, [currentRoutesBuses]);

  useEffect(() => {
    if (certainRoutes) {
      const array = [];
      certainRoutes.map((el) => {
        const id1 = getRef(el.routeName);
        if (id1 !== null && id1 !== undefined) {
          if (id1.current !== null && id1.current.offsetWidth > 112) {
            array.push(true);
          } else {
            array.push(false);
          }
        } else {
          array.push(false);
        }
      });
      setOverSize(array);
    }
  }, [certainRoutes]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      {closestStop ? (
        <>
          <div
            className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.closestBox_titlebox__marginBottom}`}
          >
            <div className={styles.linkRow__fontSize}>最近站牌</div>
            <Link
              to={`${path.certainStop}?lng=${lng}&lat=${lat}&stationName=${closestStop.stationName}&stationID=${closestStop.stationID}&stationDistance=${closestStop.stationDistance}`}
              onClick={() => {
                setCertainRoutes(dispatch, {
                  currentBuses: null,
                });
              }}
            >
              <FontAwesomeIcon
                className={styles.linkRow_arrowIcon}
                icon={faArrowRight}
              />
            </Link>
          </div>
          <div
            className={`${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.box__FlexWrap}`}
          >
            <div ref={ClosestStop_d_ref} className={styles.closestBox_stopName}>
              <p
                ref={ClosestStop_ref}
                className={
                  ClosestStopWidth > ClosestStopDivWidth
                    ? `${styles.closestBox_stopName_marquee}`
                    : ''
                }
              >
                {closestStop.stationName}
              </p>
            </div>
            <div className={styles.closestBox_stopDistance__fontSize}>
              {closestStop.stationDistance} 公尺
            </div>
          </div>
          {currentRoutesBuses && certainRoutes && remindBuses && closestStop ? (
            <div className={styles.closestBox_BusInfo}>
              {currentRoutesBuses.map((currentRoutesBus, index) => (
                <div
                  className={`${styles.closestBox_currentInfoBox} ${styles.box__alignItemsFlexStart}`}
                  key={index}
                >
                  <div className={`${styles.closestBox_flexBox}`}>
                    <div className={styles.currentInfoBox_routeInfoBox}>
                      <div className={styles.routeInfoBox_routeName}>
                        <p
                          ref={setRef(currentRoutesBus.routeName)}
                          className={
                            overSize[index] ? `${styles.marquee_animation}` : ''
                          }
                        >
                          {currentRoutesBus.routeName}
                        </p>
                      </div>
                      <div className={styles.routeInfoBox_routeDirection}>
                        {!certainRoutes[index] ||
                        currentRoutesBus.direction == 225
                          ? ''
                          : currentRoutesBus.direction == 2
                          ? '環形'
                          : currentRoutesBus.direction == 1
                          ? `往${certainRoutes[index].departureStopNameZh}`
                          : `往${certainRoutes[index].destinationStopNameZh}`}
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
                    {!currentRoutesBus.remindState ? (
                      <button
                        className={`${styles.ButtonBox_Button} ${styles.ButtonBox_openButton} ${styles.box__alignItemsCenter} ${styles.box__spaceAruond}`}
                        onClick={() => {
                          let busesArr = [...remindBuses];
                          busesArr.push({
                            currentRoutesBus,
                            certainRoute: certainRoutes[index],
                            stationID: closestStop,
                          });
                          setRemindBuses(dispatch, {
                            buses: busesArr,
                          });
                        }}
                      >
                        <FontAwesomeIcon
                          className={styles.ButtonBox_icon}
                          icon={farBell}
                        />
                        <div>開啟提醒</div>
                      </button>
                    ) : (
                      <button
                        className={`${styles.ButtonBox_Button} ${styles.ButtonBox_cancelButton} ${styles.box__alignItemsCenter} ${styles.box__spaceAruond}`}
                        onClick={() => {
                          let busesArr = [...remindBuses];
                          for (let i = 0; i < busesArr.length; i++) {
                            if (
                              busesArr[i].stationID.stationID ==
                                closestStop.stationID &&
                              busesArr[i].currentRoutesBus.direction ==
                                currentRoutesBus.direction &&
                              busesArr[i].currentRoutesBus.routeUID ==
                                currentRoutesBus.routeUID
                            ) {
                              busesArr.splice(i, 1);
                              i = busesArr.length - 1;
                              setRemindBuses(dispatch, {
                                buses: busesArr,
                              });
                            }
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          className={styles.ButtonBox_icon}
                          icon={faBell}
                        />
                        <div>取消提醒</div>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
    //   )}
    // </>
  );
}

export default ClosestStopBox;
