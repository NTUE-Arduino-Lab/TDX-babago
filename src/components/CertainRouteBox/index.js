import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

// import cityJson from '../../asset/json/city.json';

import {
  setNearbyStops,
  setSelectRouteStopsSort,
  setSelectRouteStopsTime,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';
function CertainRouteBox() {
  const reactlocation = useLocation();
  var {
    routeName,
    routeUID,
    direction,
    departureStopNameZh,
    destinationStopNameZh,
  } = QueryString.parse(reactlocation.search);
  const [directionStops, setDirectionStops] = useState([]);
  const [changeLocation, setChangeLocation] = useState(null);
  const {
    state: { position, location, selectRouteStopsSort, selectRouteStopsTime },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    if (changeLocation === null) {
      setChangeLocation(false);
    } else {
      setChangeLocation(true);
      if (position) {
        setNearbyStops(dispatch, { lng: position.lng, lat: position.lat });
      }
    }
  }, [location]);

  useEffect(() => {
    if (location && routeName && routeUID) {
      setSelectRouteStopsSort(dispatch, {
        city: location.city,
        selectRoute: {
          routeName,
          routeUID,
        },
      });
      setSelectRouteStopsTime(dispatch, {
        city: location.city,
        selectRoute: {
          routeName,
          routeUID,
        },
      });
    }
  }, [location, routeName, routeUID]);

  useEffect(() => {
    if (selectRouteStopsSort && selectRouteStopsTime && direction) {
      // console.log(selectRouteStopsSort);
      // console.log(selectRouteStopsTime);
      let stopsArr = [];
      let stopsBusesArr = [];
      for (var i = 0; i < selectRouteStopsSort.length; i++) {
        if (selectRouteStopsSort[i].direction == direction) {
          // setDirectionStops(selectRouteStopsSort[i].stops);
          stopsArr = selectRouteStopsSort[i].stops;
          for (var j = 0; j < stopsArr.length; j++) {
            for (var k = 0; k < selectRouteStopsTime.length; k++) {
              if (
                selectRouteStopsTime[k].direction == direction &&
                stopsArr[j].StopUID == selectRouteStopsTime[k].stopUID
              ) {
                // console.log(stopsArr[j]);
                // console.log(selectRouteStopsTime[k]);

                stopsBusesArr.push({
                  stopUID: stopsArr[j].StopUID,
                  // stationID: stopsArr[j].StationID,
                  stopPosition: stopsArr[j].StopPosition,
                  stopName: stopsArr[j].StopName,
                  stopBoarding: stopsArr[j].StopBoarding,
                  stopStatus:
                    selectRouteStopsTime[k].stopStatus == 4
                      ? '今日未營運'
                      : selectRouteStopsTime[k].stopStatus == 3
                      ? '末班車已過'
                      : selectRouteStopsTime[k].stopStatus == 2
                      ? '交管不停靠'
                      : selectRouteStopsTime[k].stopStatus == 0 &&
                        Math.round(selectRouteStopsTime[k].estimateTime / 60) <=
                          1
                      ? '進站中'
                      : selectRouteStopsTime[k].stopStatus == 0
                      ? `${Math.round(
                          selectRouteStopsTime[k].estimateTime / 60,
                        )} 分`
                      : '尚未發車',
                  // busEstimateTime: selectRouteStopsTime[k].estimateTime,
                  busPlateNumb: selectRouteStopsTime[k].plateNumb,
                });
              }
            }
          }

          // console.log(stopsBusesArr);
          setDirectionStops(stopsBusesArr);
        }
      }
    }
  }, [selectRouteStopsSort, selectRouteStopsTime, direction]);

  useEffect(() => {}, [directionStops]);

  return (
    <div className={styles.sidebar_box}>
      {selectRouteStopsSort &&
      directionStops &&
      departureStopNameZh &&
      destinationStopNameZh ? (
        <>
          <div className={styles.topBox_padding}>
            <div
              className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.certainRouteBox_titleBox}`}
            >
              {routeName}
            </div>
            <div
              className={`${styles.certainRouteBox_buttonBox} ${styles.box__spaceBetween}`}
            >
              {selectRouteStopsSort.map((stop, index) => (
                <Link
                  to={`${path.certainRoute}?routeName=${routeName}&routeUID=${routeUID}&direction=${stop.direction}&departureStopNameZh=${departureStopNameZh}&destinationStopNameZh=${destinationStopNameZh}`}
                  className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`}
                  key={`${stop.routeUID}-${index}`}
                >
                  {stop.direction ? departureStopNameZh : destinationStopNameZh}
                </Link>
              ))}
            </div>
          </div>
          <div
            className={`${styles.bottomBox_padding} ${styles.box__spaceBetween}`}
          >
            <div className={styles.certainRouteBox_routeStopBox}>
              {directionStops.map((stop, index) => (
                <div
                  className={styles.routeStopBox_stopInfoBox}
                  key={`${stop.stopUID}-1-${index}`}
                  id={stop.stopUID}
                >
                  <div
                    // className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_busStatus}`}
                    className={
                      stop.stopStatus === '進站中'
                        ? `${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_busStatus} ${styles.routeState__textYellow}`
                        : stop.stopStatus === '尚未發車' ||
                          stop.stopStatus === '交管不停靠' ||
                          stop.stopStatus === '末班車已過' ||
                          stop.stopStatus === '今日未營運'
                        ? `${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_busStatus} ${styles.routeState__textGray}`
                        : `${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_busStatus} ${styles.routeState__textDark}`
                    }
                  >
                    {stop.stopStatus}
                  </div>
                  <div
                    className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_stopName}`}
                  >
                    {stop.stopName.Zh_tw}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.certainRouteBox_routeDotBox}>
              <div className={styles.routeDotBox_routeLine}></div>
              {directionStops.map((stop, index) => (
                <div
                  className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.routeDotBox_stopCircleBox}`}
                  key={`${stop.stopUID}-2-${index}`}
                >
                  <div className={styles.stopCircleBox_stopCircle}>
                    {/* {city.cityEn} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default CertainRouteBox;
