import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useDynamicRefs from 'use-dynamic-refs';

import path from '../../router/path';
import styles from './styles.module.scss';

import {
  setNearbyStops,
  setCurrentBuses,
  setCertainRoutes,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBus,
  faArrowAltCircleRight,
  faRoute,
} from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';

function CertainStopBox() {
  const [getRef, setRef] = useDynamicRefs();
  const [OverSize, SetOverSize] = useState([]);

  const reactlocation = useLocation();
  var { clickStopIndex } = reactlocation.state;
  const [certainStop, setCertainStop] = useState(null);
  const [changeLocation, setChangeLocation] = useState(null);
  const [frontCertainRoutes, SetFrontCertainRoutes] = useState([]);
  const [currentRoutesBuses, SetCurrentRoutesBuses] = useState([]);
  const {
    state: { position, location, nearbyStops, currentBuses, certainRoutes },
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
      setCurrentBuses(dispatch, {
        city: location.city,
        stationID: certainStop.stationID,
      });
    }
  }, [location, certainStop]);

  useEffect(() => {
    if (currentBuses) {
      SetCurrentRoutesBuses(currentBuses);
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

    //跑馬燈
    if (currentRoutesBuses.length > 0) {
      const array = [];
      currentRoutesBuses.map((el) => {
        var p_ref = getRef(el.routeName + '_p');
        var div_ref = getRef(el.routeName + '_div');
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
  }, [currentRoutesBuses]);

  useEffect(() => {
    if (certainRoutes) {
      SetFrontCertainRoutes(certainRoutes);
    }
  }, [certainRoutes]);

  useEffect(() => {}, [frontCertainRoutes]);

  useEffect(() => {
    console.log(OverSize);
  }, [OverSize]);

  return (
    <div className={styles.sidebar_box}>
      <div className={styles.certainStopBox_titlebox__marginBottom}>
        {nearbyStops && nearbyStops[clickStopIndex] && location ? (
          <>
            <div
              className={`${styles.box__alignItemsCenter} ${styles.box__start} ${styles.certainStopBox_stopName}`}
            >
              {nearbyStops[clickStopIndex].stationName}
            </div>
            <div
              className={`${styles.box__alignItemsCenter} ${styles.certainStopBox_stopInfo}`}
            >
              <div className={styles.stopInfo_detailBox}>
                <div>{location.city}</div>
                <div>{location.town}</div>
                <div>{nearbyStops[clickStopIndex].stationDistance} 公尺</div>
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
          </>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.certainStopBox_ChangeRouteBox}>
        <div className={styles.ChangeRouteBox_RouteBox}>1</div>
        <div className={styles.ChangeRouteBox_RouteBox}>2</div>
        <div className={styles.ChangeRouteBox_RouteBox}>3</div>
      </div>
      {currentRoutesBuses && frontCertainRoutes ? (
        <div className={styles.certainStopBox_AllRouteBox}>
          {currentRoutesBuses.map((currentRoutesBus, index) => (
            <div className={styles.certainStopBox_certainRouteBox} key={index}>
              <Link
                to={path.certainRoute}
                className={styles.certainRouteBox_linkSetting}
                state={
                  frontCertainRoutes[index]
                    ? {
                        currentRoutesBus: {
                          direction: currentRoutesBus.direction,
                          routeName: currentRoutesBus.routeName,
                          routeUID: currentRoutesBus.routeUID,
                        },
                        frontCertainRoute: frontCertainRoutes[index],
                      }
                    : {}
                }
              >
                <div
                  className={`${styles.certainRouteBox_frontBox} ${styles.box__alignItemsCenter}`}
                  key={index}
                >
                  <div className={styles.certainRouteBox_routeInfo}>
                    <div
                      ref={setRef(currentRoutesBus.routeName + '_div')}
                      className={styles.certainRouteBox_routeNameBox}
                    >
                      <p
                        ref={setRef(currentRoutesBus.routeName + '_p')}
                        className={
                          OverSize[index]
                            ? `${styles.marquee_animation} ${styles.certainRouteBox_routeName}`
                            : `${styles.certainRouteBox_routeName}`
                        }
                      >
                        {currentRoutesBus.routeName}
                      </p>
                    </div>
                    <div className={styles.certainRouteBox_routeDirection}>
                      {!frontCertainRoutes[index] ||
                      currentRoutesBus.direction == 225
                        ? ''
                        : currentRoutesBus.direction == 2
                        ? '環形'
                        : currentRoutesBus.direction == 1
                        ? `往${frontCertainRoutes[index].departureStopNameZh}`
                        : `往${frontCertainRoutes[index].destinationStopNameZh}`}
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
              </Link>
              <div
                className={`${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.certainRouteBox_ButtonBox}`}
              >
                <div
                  className={`${styles.ButtonBox_Button} ${styles.Button_Blue} ${styles.box__alignItemsCenter}`}
                >
                  <FontAwesomeIcon
                    className={styles.Button_icon}
                    icon={faBus}
                  />
                  <div>預約上車</div>
                </div>
                <div
                  className={`${styles.ButtonBox_Button} ${styles.Button_Blue} ${styles.box__alignItemsCenter}`}
                >
                  <FontAwesomeIcon
                    className={styles.Button_icon}
                    icon={farBell}
                  />
                  <div>開啟提醒</div>
                </div>
                <div
                  className={`${styles.ButtonBox_Button} ${styles.Button_Blue} ${styles.box__alignItemsCenter}`}
                >
                  <FontAwesomeIcon
                    className={styles.Button_icon}
                    icon={faRoute}
                  />
                  <div>查看路線</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default CertainStopBox;
