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
import { faArrowRight, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { remindNotification } from '../../store/firebase';

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
      token,
    },
    dispatch,
  } = useContext(StoreContext);
  const [closestStop, setClosestStop] = useState(null);
  const [currentRoutesBuses, setCurrentRoutesBuses] = useState(null);
  const [pageUpdate, setPageUpdate] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageUpdate(!pageUpdate);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [pageUpdate]);

  useEffect(() => {
    if (nearbyStops && nearbyStops[0]) {
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
  }, [closestStop, pageUpdate]);

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
          if (remindBuses[i].stationName == closestStop.stationName) {
            for (let j = 0; j < array.length; j++) {
              if (
                remindBuses[i].routeUID == array[j].routeUID &&
                remindBuses[i].direction == array[j].direction
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
            <div className={styles.linkRow__fontSize}>????????????</div>
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
              {closestStop.stationDistance} ??????
            </div>
          </div>
          {currentRoutesBuses && certainRoutes && remindBuses && closestStop ? (
            <div className={styles.closestBox_BusInfo}>
              {currentRoutesBuses.map((currentRoutesBus, index) => (
                <div className={styles.currentInfoBox_closestBox} key={index}>
                  <div
                    className={`${styles.closestBox_currentInfoBox} ${styles.box__alignItemsFlexStart}`}
                  >
                    <div className={`${styles.closestBox_flexBox}`}>
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
                      <div
                        className={
                          currentRoutesBus.stopStatus === '?????????'
                            ? `${styles.currentInfoBox_routeState} ${styles.routeState__textYellow}`
                            : currentRoutesBus.stopStatus === '????????????' ||
                              currentRoutesBus.stopStatus === '???????????????' ||
                              currentRoutesBus.stopStatus === '???????????????' ||
                              currentRoutesBus.stopStatus === '???????????????'
                            ? `${styles.currentInfoBox_routeState} ${styles.routeState__textGray}`
                            : `${styles.currentInfoBox_routeState} ${styles.routeState__textDark}`
                        }
                      >
                        {currentRoutesBus.stopStatus}
                      </div>
                    </div>
                    {/* ??????????????? */}
                    <div className={styles.currentInfoBox_ButtonBox}>
                      {!currentRoutesBus.stopStatus ||
                      currentRoutesBus.stopStatus === '????????????' ||
                      currentRoutesBus.stopStatus === '???????????????' ||
                      currentRoutesBus.stopStatus === '???????????????' ||
                      currentRoutesBus.stopStatus === '???????????????' ? (
                        <button
                          className={`${styles.ButtonBox_Button} ${styles.ButtonBox_disableButton} ${styles.box__alignItemsCenter} ${styles.box__spaceAruond}`}
                        >
                          <FontAwesomeIcon
                            className={styles.ButtonBox_icon}
                            icon={farBell}
                          />
                          <div>????????????</div>
                        </button>
                      ) : !currentRoutesBus.remindState ? (
                        <button
                          className={`${styles.ButtonBox_Button} ${styles.ButtonBox_openButton} ${styles.box__alignItemsCenter} ${styles.box__spaceAruond}`}
                          onClick={() => {
                            let busesArr = [...remindBuses];
                            busesArr.push({
                              stationName: closestStop.stationName,
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
                            remindNotification(
                              {
                                stationName: closestStop.stationName,
                                routeName: currentRoutesBus.routeName,
                                stopStatus: currentRoutesBus.stopStatus,
                              },
                              token,
                            );
                          }}
                        >
                          <FontAwesomeIcon
                            className={styles.ButtonBox_icon}
                            icon={farBell}
                          />
                          <div>????????????</div>
                        </button>
                      ) : (
                        <button
                          className={`${styles.ButtonBox_Button} ${styles.ButtonBox_cancelButton} ${styles.box__alignItemsCenter} ${styles.box__spaceAruond}`}
                          onClick={() => {
                            let busesArr = [...remindBuses];
                            for (let i = 0; i < busesArr.length; i++) {
                              if (
                                busesArr[i].stationName ==
                                  closestStop.stationName &&
                                busesArr[i].direction ==
                                  currentRoutesBus.direction &&
                                busesArr[i].routeUID ==
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
                            icon={faBellSlash}
                          />
                          <div>????????????</div>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={styles.routeInfoBox_routeDirection}>
                    {!certainRoutes[index] || currentRoutesBus.direction == 225
                      ? ''
                      : currentRoutesBus.direction == 2
                      ? '??????'
                      : currentRoutesBus.direction == 1
                      ? `???${certainRoutes[index].departureStopNameZh}`
                      : `???${certainRoutes[index].destinationStopNameZh}`}
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
