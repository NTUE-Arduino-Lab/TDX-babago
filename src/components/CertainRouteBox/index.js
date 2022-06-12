import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import {
  setCurrentBuses,
  setSelectRouteStopsSort,
  setSelectRouteStopsTime,
  setSelectRouteBuses,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBus,
  faArrowAltCircleRight,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
function CertainRouteBox() {
  const [openStops, setOpenStops] = useState('0');
  const reactlocation = useLocation();
  var {
    lng,
    lat,
    stationUID,
    routeName,
    routeUID,
    direction,
    departureStopNameZh,
    destinationStopNameZh,
  } = QueryString.parse(reactlocation.search);
  const [directionStops, setDirectionStops] = useState([]);
  const {
    state: {
      location,
      selectRouteStopsSort,
      selectRouteStopsTime,
      selectRouteBuses,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    setCurrentBuses(dispatch, {
      city: '',
      stationID: '',
    });
  }, []);

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
      setSelectRouteBuses(dispatch, {
        city: location.city,
        selectRoute: {
          routeName,
          routeUID,
        },
      });
    }
  }, [location, routeName, routeUID]);

  useEffect(() => {
    if (
      selectRouteStopsSort &&
      selectRouteStopsTime &&
      selectRouteBuses &&
      direction
    ) {
      let i = 0;
      let stopsArr = [];
      let stopsTimeArr = [];
      let routeBusesArr = [];

      for (i = 0; i < selectRouteStopsSort.length; i++) {
        if (selectRouteStopsSort[i].direction == direction) {
          stopsArr = selectRouteStopsSort[i].stops;
        }
      }

      if (selectRouteBuses.length > 0) {
        for (var j = 0; j < selectRouteBuses.length; j++) {
          if (selectRouteBuses[j].direction == direction) {
            routeBusesArr.push(selectRouteBuses[j]);
          }
        }
      }

      for (var x = 0; x < stopsArr.length; x++) {
        for (var y = 0; y < selectRouteStopsTime.length; y++) {
          if (
            selectRouteStopsTime[y].direction == direction &&
            stopsArr[x].StopUID == selectRouteStopsTime[y].stopUID
          ) {
            stopsTimeArr.push({
              stopUID: stopsArr[x].StopUID,
              // stationID: stopsArr[x].StationID,
              stopPosition: stopsArr[x].StopPosition,
              stopName: stopsArr[x].StopName,
              stopBoarding: stopsArr[x].StopBoarding,
              stopStatus:
                selectRouteStopsTime[y].stopStatus == 4
                  ? '今日未營運'
                  : selectRouteStopsTime[y].stopStatus == 3
                  ? '末班車已過'
                  : selectRouteStopsTime[y].stopStatus == 2
                  ? '交管不停靠'
                  : selectRouteStopsTime[y].stopStatus == 0 &&
                    Math.round(selectRouteStopsTime[y].estimateTime / 60) <= 1
                  ? '進站中'
                  : selectRouteStopsTime[y].stopStatus == 0
                  ? `${Math.round(
                      selectRouteStopsTime[y].estimateTime / 60,
                    )} 分`
                  : '尚未發車',
              buses: [],
              // busEstimateTime: selectRouteStopsTime[y].estimateTime,
              // busPlateNumb: selectRouteStopsTime[y].plateNumb,
            });
          }
        }
      }

      for (i = 0; i < stopsTimeArr.length; i++) {
        for (var z = 0; z < routeBusesArr.length; z++) {
          if (stopsTimeArr[i].stopUID == routeBusesArr[z].stopUID) {
            let index = i;
            if (!routeBusesArr[z].a2EventType) {
              index = i + 1;
            }

            stopsTimeArr[index].buses.push({
              plateNumb: routeBusesArr[z].plateNumb,
              busStatus: routeBusesArr[z].busStatus,
              dutyStatus: routeBusesArr[z].dutyStatus,
              stopSequence: routeBusesArr[z].stopSequence,
            });
          }
        }
      }

      // console.log(stopsTimeArr);
      setDirectionStops(stopsTimeArr);
    }
  }, [selectRouteStopsSort, selectRouteStopsTime, selectRouteBuses, direction]);

  useEffect(() => {}, [
    directionStops,
    departureStopNameZh,
    destinationStopNameZh,
  ]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      {selectRouteStopsSort &&
      routeName &&
      departureStopNameZh &&
      destinationStopNameZh ? (
        <div className={styles.topBox_padding}>
          <div
            className={`${styles.box__alignItemsCenter} ${styles.box__start} ${styles.certainRouteBox_titleBox}`}
          >
            {routeName}
          </div>
          <div
            className={`${styles.box__alignItemsCenter} ${styles.certainRouteBox_routeInfo} ${styles.box__spaceBetween}`}
          >
            <div className={styles.routeInfo_detailBox}>
              <div>新莊</div>
              <div>－</div>
              <div>國父紀念館</div>
              <div>｜</div>
              <div>63站</div>
            </div>
            <div
              className={`${styles.ButtonBox_Button} ${styles.Button_White_outline} ${styles.box__alignItemsCenter}`}
            >
              <FontAwesomeIcon
                className={styles.Button_icon}
                icon={faInfoCircle}
              />
              <div>路線規劃</div>
            </div>
          </div>
          <div
            className={`${styles.certainRouteBox_buttonBox} ${styles.box__spaceBetween}`}
          >
            {selectRouteStopsSort.map((stop, index) => (
              <Link
                to={`${path.certainRoute}?lng=${lng}&lat=${lat}&stationUID=${stationUID}&routeName=${routeName}&routeUID=${routeUID}&direction=${stop.direction}&departureStopNameZh=${departureStopNameZh}&destinationStopNameZh=${destinationStopNameZh}`}
                className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`}
                key={`${stop.routeUID}-${index}`}
              >
                {stop.direction ? departureStopNameZh : destinationStopNameZh}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      {directionStops ? (
        <div
          className={`${styles.bottomBox_padding} ${styles.box__spaceBetween}`}
        >
          <div className={styles.certainRouteBox_routeStopBox}>
            {directionStops.map((stop, index) => (
              <div
                className={styles.certainRouteBox_routeInfoBox}
                key={`${stop.stopUID}-1-${index}`}
              >
                <div
                  className={styles.routeStopBox_stopInfoBox}
                  id={stop.stopUID}
                  onClick={() => {
                    setOpenStops(stop.stopUID);
                  }}
                >
                  <div
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
                    className={
                      openStops === stop.stopUID
                        ? `${styles.stopInfoBox_stopName_open}`
                        : '' +
                          `${styles.box__alignItemsCenter} ${styles.box__start} ${styles.stopInfoBox_stopName}`
                    }
                  >
                    {stop.stopName.Zh_tw}
                  </div>
                </div>
                <div
                  className={
                    openStops === stop.stopUID
                      ? `${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.stopInfoBox_ButtonBox}`
                      : `${styles.stopInfoBox_ButtonBox_close}`
                  }
                >
                  <div
                    className={`${styles.ButtonBox_Button} ${styles.Button_Blue} ${styles.box__alignItemsCenter}`}
                  >
                    <FontAwesomeIcon
                      className={styles.Button_icon}
                      icon={faBus}
                    />
                    <div>預約下車</div>
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
                      icon={faArrowAltCircleRight}
                    />
                    <div>路線規劃</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.certainRouteBox_routeDotBox}>
            <div className={styles.routeDotBox_routeLine}></div>
            {directionStops.map((stop, index) => (
              <div
                className={
                  openStops === stop.stopUID
                    ? `${styles.box__alignItemsStart} ${styles.box__center} ${styles.routeDotBox_stopCircleBox} ${styles.routeDotBox_stopCircleBox_open}`
                    : `${styles.box__alignItemsCenter} ${styles.box__center} ${styles.routeDotBox_stopCircleBox}`
                }
                key={`${stop.stopUID}-2-${index}`}
              >
                <div
                  className={
                    stop.buses.length > 0
                      ? `${styles.stopCircleBox_stopCircle} ${styles.backgroundColor_B}`
                      : `${styles.stopCircleBox_stopCircle} ${styles.backgroundColor_W}`
                  }
                >
                  {stop.buses.length > 0 ? (
                    <div className={styles.stopCircle_plateNumb}>
                      {stop.buses.map((bus) => (
                        <div key={bus.plateNumb}>{bus.plateNumb}</div>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
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

export default CertainRouteBox;
