import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';
import useDynamicRefs from 'use-dynamic-refs';

import path from '../../router/path';
import styles from './styles.module.scss';

import {
  setSelectRouteStopsSort,
  setSelectRouteStopsTime,
  setSelectRouteBuses,
  setCurrentBuses,
  setCertainRoutes,
  setRemindBuses,
  setReserveBus,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBus,
  faArrowAltCircleRight,
  faRoute,
} from '@fortawesome/free-solid-svg-icons';
// import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { onReserveNotification } from '../../store/firebase';

function CertainStopBox() {
  const [getRef, setRef] = useDynamicRefs();
  const [overSize, SetOverSize] = useState([]);

  const reactlocation = useLocation();
  const { lng, lat, stationID, stationName, stationDistance } =
    QueryString.parse(reactlocation.search);

  const {
    state: {
      location,
      nearbyStops,
      currentBuses,
      certainRoutes,
      remindBuses,
      reserveBus,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);
  const [nearbyStopsName, setNearbyStopsName] = useState(null);
  const [currentRoutesBuses, setCurrentRoutesBuses] = useState(null);
  const [openRoutes, setOpenRoutes] = useState('0');
  const [pageUpdate, setPageUpdate] = useState(true);

  useEffect(() => {
    setSelectRouteStopsSort(dispatch, {
      city: null,
      selectRoute: null,
    });
    setSelectRouteStopsTime(dispatch, {
      city: null,
      selectRoute: null,
    });
    setSelectRouteBuses(dispatch, {
      city: null,
      selectRoute: null,
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageUpdate(!pageUpdate);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [pageUpdate]);

  useEffect(() => {
    if (nearbyStops && stationName) {
      const nearbyStops2 = [...nearbyStops];
      for (let i = 0; i < nearbyStops2.length; i++) {
        if (stationName == nearbyStops2[i].stationName) {
          setNearbyStopsName(nearbyStops2[i].stationIDs);
          i = nearbyStops2.length;
        }
      }
      setCurrentBuses(dispatch, {
        authorityCodes: null,
        stationID: null,
      });
    }
  }, [nearbyStops, stationName]);

  useEffect(() => {
    if (nearbyStopsName && stationID) {
      for (let i = 0; i < nearbyStopsName.length; i++) {
        if (nearbyStopsName[i].stationID == stationID) {
          setCurrentBuses(dispatch, {
            authorityCodes: nearbyStopsName[i].authorityCodes,
            stationID: stationID,
          });
          // setCertainRoutes(dispatch, {
          //   currentBuses: null,
          // });
          i = nearbyStopsName.length;
        }
      }
    }
  }, [nearbyStopsName, stationID, pageUpdate]);

  useEffect(() => {
    if (currentBuses) {
      setCertainRoutes(dispatch, {
        currentBuses: currentBuses,
      });

      let currentBuses2 = [...currentBuses];
      if (remindBuses.length > 0) {
        let remindBusesArray = new Array(currentBuses2.length).fill(false);
        for (let i = 0; i < remindBuses.length; i++) {
          if (remindBuses[i].stationName == stationName) {
            for (let j = 0; j < currentBuses2.length; j++) {
              if (
                remindBuses[i].routeUID == currentBuses2[j].routeUID &&
                remindBuses[i].direction == currentBuses2[j].direction
              ) {
                remindBusesArray[j] = true;
              }
            }
          }
        }
        for (let i = 0; i < currentBuses2.length; i++) {
          currentBuses2[i].remindState = remindBusesArray[i];
          if (
            reserveBus &&
            reserveBus.stationID == stationID &&
            reserveBus.routeUID == currentBuses2[i].routeUID &&
            reserveBus.direction == currentBuses2[i].direction
          ) {
            currentBuses2[i].reverseState = true;
          } else {
            currentBuses2[i].reverseState = false;
          }
        }
      } else {
        for (let i = 0; i < currentBuses2.length; i++) {
          currentBuses2[i].remindState = false;
          if (
            reserveBus &&
            reserveBus.stationID == stationID &&
            reserveBus.routeUID == currentBuses2[i].routeUID &&
            reserveBus.direction == currentBuses2[i].direction
          ) {
            currentBuses2[i].reverseState = true;
          } else {
            currentBuses2[i].reverseState = false;
          }
        }
      }
      setCurrentRoutesBuses(currentBuses2);
    }
  }, [currentBuses, remindBuses.length, reserveBus]);

  useEffect(() => {
    if (currentRoutesBuses && certainRoutes && currentRoutesBuses.length > 0) {
      const array = [];
      currentRoutesBuses.map((el) => {
        let p_ref = getRef(el.routeName + '_p');
        let div_ref = getRef(el.routeName + '_div');
        if (p_ref !== null && p_ref !== undefined) {
          if (
            div_ref.current !== null &&
            p_ref.current !== null &&
            p_ref.current.offsetWidth > div_ref.current.offsetWidth
          ) {
            console.log(p_ref.current.offsetWidth);
            console.log(div_ref.current.offsetWidth);
            array.push(true);
          } else {
            array.push(false);
          }
        } else {
          array.push(false);
        }
      });
      SetOverSize(array);
    }
  }, [certainRoutes, currentRoutesBuses]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      {stationName && stationDistance && location ? (
        <div className={styles.certainStopBox_titlebox__marginBottom}>
          <div
            className={`${styles.box__alignItemsCenter} ${styles.box__start} ${styles.certainStopBox_stopName}`}
          >
            {stationName}
          </div>
          <div
            className={`${styles.box__alignItemsCenter} ${styles.certainStopBox_stopInfo}`}
          >
            <div className={styles.stopInfo_detailBox}>
              <div>{location.city}</div>
              <div>{location.town}</div>
              <div>{stationDistance} 公尺</div>
            </div>
            <div
              className={`${styles.ButtonBox_Button} ${styles.Button_White} ${styles.box__alignItemsCenter}`}
            >
              <FontAwesomeIcon
                className={styles.Button_icon}
                icon={faArrowAltCircleRight}
              />
              <div>路線規劃</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.certainStopBox_titlebox__marginBottom}></div>
      )}
      <div className={styles.certainStopBox_ChangeRouteBox}>
        {nearbyStopsName && nearbyStopsName.length > 0 ? (
          <>
            {nearbyStopsName.map((stopName, index) => (
              <Link
                to={`${path.certainStop}?lng=${lng}&lat=${lat}&stationName=${stopName.stationName}&stationID=${stopName.stationID}&stationDistance=${stopName.stationDistance}`}
                className={
                  stopName.stationID == stationID
                    ? `${styles.ChangeRouteBox_RouteBox} ${styles.ChangeRouteBox_RouteBoxFocus}`
                    : `${styles.ChangeRouteBox_RouteBox}`
                }
                key={index}
              >
                {index + 1}
              </Link>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
      {currentRoutesBuses &&
      certainRoutes &&
      currentRoutesBuses.length > 0 &&
      certainRoutes.length > 0 ? (
        <div className={styles.certainStopBox_AllRouteBox}>
          {currentRoutesBuses.map((currentRoutesBus, index) => (
            <div className={styles.certainStopBox_certainRouteBox} key={index}>
              <div
                className={`${styles.certainRouteBox_frontBox} ${styles.box__alignItemsCenter}`}
                key={index}
                onClick={() => {
                  setOpenRoutes(currentRoutesBus.routeName + index);
                }}
              >
                <div className={styles.certainRouteBox_routeInfo}>
                  <div
                    ref={setRef(currentRoutesBus.routeName + '_div')}
                    className={styles.certainRouteBox_routeNameBox}
                  >
                    <p
                      ref={setRef(currentRoutesBus.routeName + '_p')}
                      className={
                        overSize[index]
                          ? `${styles.marquee_animation} ${styles.certainRouteBox_routeName}`
                          : `${styles.certainRouteBox_routeName}`
                      }
                    >
                      {currentRoutesBus.routeName}
                    </p>
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
                </div>
                <div
                  className={
                    currentRoutesBus.stopStatus === '進站中'
                      ? `${styles.certainRouteBox_routeState} ${styles.routeState__textYellow}`
                      : currentRoutesBus.stopStatus === '尚未發車' ||
                        currentRoutesBus.stopStatus === '交管不停靠' ||
                        currentRoutesBus.stopStatus === '末班車已過' ||
                        currentRoutesBus.stopStatus === '今日未營運'
                      ? `${styles.certainRouteBox_routeState} ${styles.routeState__textGray}`
                      : `${styles.certainRouteBox_routeState} ${styles.routeState__textDark}`
                  }
                >
                  {currentRoutesBus.stopStatus}
                </div>
              </div>

              <div
                className={
                  openRoutes == currentRoutesBus.routeName + index
                    ? `${styles.certainRouteBox_ButtonBox}`
                    : `${styles.box_displayNone}`
                }
              >
                {!currentRoutesBus.stopStatus ||
                currentRoutesBus.stopStatus === '尚未發車' ||
                currentRoutesBus.stopStatus === '交管不停靠' ||
                currentRoutesBus.stopStatus === '末班車已過' ||
                currentRoutesBus.stopStatus === '今日未營運' ? (
                  <button
                    className={`${styles.Button_rowButton} ${styles.Button_disableButton} ${styles.box__alignItemsCenter}`}
                  >
                    <FontAwesomeIcon
                      className={styles.Button_icon}
                      icon={faBus}
                    />
                    <div>預約上車</div>
                  </button>
                ) : !currentRoutesBus.reverseState ? (
                  <button
                    className={`${styles.Button_rowButton} ${styles.Button_enableButton} ${styles.box__alignItemsCenter}`}
                    onClick={() => {
                      setReserveBus(dispatch, {
                        bus: {
                          stationID,
                          stationName,
                          routeUID: currentRoutesBus.routeUID,
                          routeName: currentRoutesBus.routeName,
                          direction: currentRoutesBus.direction,
                          stopStatus: currentRoutesBus.stopStatus,
                          departureStopNameZh:
                            certainRoutes[index].departureStopNameZh,
                          destinationStopNameZh:
                            certainRoutes[index].destinationStopNameZh,
                        },
                      });
                      onReserveNotification({
                        bus: {
                          stationID,
                          stationName,
                          routeUID: currentRoutesBus.routeUID,
                          routeName: currentRoutesBus.routeName,
                          direction: currentRoutesBus.direction,
                          stopStatus: currentRoutesBus.stopStatus,
                          departureStopNameZh:
                            certainRoutes[index].departureStopNameZh,
                          destinationStopNameZh:
                            certainRoutes[index].destinationStopNameZh,
                        },
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      className={styles.Button_icon}
                      icon={faBus}
                    />
                    <div>預約上車</div>
                  </button>
                ) : (
                  <button
                    className={`${styles.Button_rowButton} ${styles.Button_enableButton} ${styles.box__alignItemsCenter}`}
                    onClick={() => {
                      setReserveBus(dispatch, {
                        buses: null,
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      className={styles.Button_icon}
                      icon={faBus}
                    />
                    <div>取消預約</div>
                  </button>
                )}

                {!currentRoutesBus.stopStatus ||
                currentRoutesBus.stopStatus === '尚未發車' ||
                currentRoutesBus.stopStatus === '交管不停靠' ||
                currentRoutesBus.stopStatus === '末班車已過' ||
                currentRoutesBus.stopStatus === '今日未營運' ? (
                  <button
                    className={`${styles.Button_rowButton} ${styles.Button_disableButton} ${styles.box__alignItemsCenter}`}
                  >
                    <FontAwesomeIcon
                      className={styles.Button_icon}
                      icon={farBell}
                    />
                    <div>開啟提醒</div>
                  </button>
                ) : !currentRoutesBus.remindState ? (
                  <button
                    className={`${styles.Button_rowButton} ${styles.Button_enableButton} ${styles.box__alignItemsCenter}`}
                    onClick={() => {
                      let busesArr = [...remindBuses];
                      busesArr.push({
                        stationName,
                        routeUID: currentRoutesBus.routeUID,
                        routeName: currentRoutesBus.routeName,
                        direction: currentRoutesBus.direction,
                        stopStatus: currentRoutesBus.stopStatus,
                        departureStopNameZh:
                          certainRoutes[index].departureStopNameZh,
                        destinationStopNameZh:
                          certainRoutes[index].destinationStopNameZh,
                      });
                      setRemindBuses(dispatch, {
                        buses: busesArr,
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      className={styles.Button_icon}
                      icon={farBell}
                    />
                    <div>開啟提醒</div>
                  </button>
                ) : (
                  <button
                    className={`${styles.Button_rowButton} ${styles.Button_enableButton} ${styles.box__alignItemsCenter}`}
                    onClick={() => {
                      let busesArr = [...remindBuses];
                      for (let i = 0; i < busesArr.length; i++) {
                        if (
                          busesArr[i].stationName == stationName &&
                          busesArr[i].direction == currentRoutesBus.direction &&
                          busesArr[i].routeUID == currentRoutesBus.routeUID
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
                      className={styles.Button_icon}
                      icon={farBell}
                    />
                    <div>取消提醒</div>
                  </button>
                )}
                <Link
                  to={
                    certainRoutes[index]
                      ? `${path.certainRoute}?lng=${lng}&lat=${lat}&stationID=${stationID}&routeName=${currentRoutesBus.routeName}&routeUID=${currentRoutesBus.routeUID}&direction=${currentRoutesBus.direction}&departureStopNameZh=${certainRoutes[index].departureStopNameZh}&destinationStopNameZh=${certainRoutes[index].destinationStopNameZh}`
                      : ''
                  }
                  className={`${styles.Button_rowButton} ${styles.Button_enableButton} ${styles.box__alignItemsCenter} ${styles.certainRouteBox_linkSetting}`}
                >
                  <FontAwesomeIcon
                    className={styles.Button_icon}
                    icon={faRoute}
                  />
                  <div>查看路線</div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : currentRoutesBuses &&
        certainRoutes &&
        currentRoutesBuses.length == 0 &&
        certainRoutes.length == 0 ? (
        <div className={styles.certainStopBox_noInfoBox}>
          <div className={styles.box__center}>
            <div className={styles.certainStopBox_noInfoImg}></div>
          </div>
          <div className={styles.box__center}>
            <div className={styles.certainStopBox_noInfoText}>
              此站牌沒有 公車路線
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
    //   )}
    // </>
  );
}

export default CertainStopBox;
