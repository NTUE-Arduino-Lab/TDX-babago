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
  const {
    lng,
    lat,
    stationID,
    routeName,
    routeUID,
    direction,
    departureStopNameZh,
    destinationStopNameZh,
  } = QueryString.parse(reactlocation.search);
  const {
    state: {
      selectRouteStopsSort,
      selectRouteStopsTime,
      selectRouteBuses,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);
  const [stopsArr, setStopsArr] = useState([]);
  const [stopsTimeArr, setStopsTimeArr] = useState([]);
  const [routeBusesArr, setRouteBusesArr] = useState([]);
  const [directionStops, setDirectionStops] = useState([]);

  useEffect(() => {
    setCurrentBuses(dispatch, {
      city: '',
      stationID: '',
    });
  }, []);

  useEffect(() => {
    if (routeName && routeUID) {
      setSelectRouteStopsSort(dispatch, {
        selectRoute: {
          routeName,
          routeUID,
        },
      });
      setSelectRouteStopsTime(dispatch, {
        selectRoute: {
          routeName,
          routeUID,
        },
      });
      setSelectRouteBuses(dispatch, {
        selectRoute: {
          routeName,
          routeUID,
        },
      });
    }
  }, [routeName, routeUID]);

  useEffect(() => {
    if (selectRouteStopsSort) {
      for (var i = 0; i < selectRouteStopsSort.length; i++) {
        if (selectRouteStopsSort[i].direction == direction) {
          setStopsArr(selectRouteStopsSort[i].stops);
          i = selectRouteStopsSort.length;
        }
      }
    }
  }, [selectRouteStopsSort, direction]);

  useEffect(() => {
    if (selectRouteStopsTime && stopsArr.length > 0) {
      let stopsTimeArr2 = [];
      for (var x = 0; x < stopsArr.length; x++) {
        for (var y = 0; y < selectRouteStopsTime.length; y++) {
          if (
            selectRouteStopsTime[y].direction == direction &&
            stopsArr[x].StopUID == selectRouteStopsTime[y].stopUID
          ) {
            stopsTimeArr2.push({
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
            y = selectRouteStopsTime.length - 1;
          }
          if (
            x == stopsArr.length - 1 &&
            y == selectRouteStopsTime.length - 1
          ) {
            setStopsTimeArr(stopsTimeArr2);
          }
        }
      }
    }
  }, [selectRouteStopsTime, stopsArr, direction]);

  useEffect(() => {
    if (selectRouteBuses) {
      if (selectRouteBuses.length > 0) {
        let routeBusesArr2 = [];
        for (var j = 0; j < selectRouteBuses.length; j++) {
          if (selectRouteBuses[j].direction == direction) {
            routeBusesArr2.push(selectRouteBuses[j]);
          }
          if (j == selectRouteBuses.length - 1) {
            if (routeBusesArr2.length > 0) {
              setRouteBusesArr(routeBusesArr2);
            } else {
              setRouteBusesArr(-1);
            }
          }
        }
      } else {
        setRouteBusesArr(-1);
      }
    }
  }, [selectRouteBuses, direction]);

  useEffect(() => {
    if (stopsTimeArr.length > 0) {
      if (routeBusesArr == -1) {
        setDirectionStops(stopsTimeArr);
      } else if (routeBusesArr.length > 0) {
        let directionStops2 = stopsTimeArr;

        for (var m = 0; m < stopsTimeArr.length; m++) {
          for (var n = 0; n < routeBusesArr.length; n++) {
            if (stopsTimeArr[m].stopUID == routeBusesArr[n].stopUID) {
              let index = m;
              if (!routeBusesArr[n].a2EventType && m < stopsTimeArr.length) {
                index = m + 1;
              }

              directionStops2[index].buses.push({
                plateNumb: routeBusesArr[n].plateNumb,
                busStatus: routeBusesArr[n].busStatus,
                dutyStatus: routeBusesArr[n].dutyStatus,
                stopSequence: routeBusesArr[n].stopSequence,
              });
            }
            if (m == stopsTimeArr.length - 1 && n == routeBusesArr.length - 1) {
              setDirectionStops(directionStops2);
            }
          }
        }
      }
    }
  }, [stopsTimeArr, routeBusesArr]);

  useEffect(() => {
    // console.log(directionStops);
  }, [directionStops, departureStopNameZh, destinationStopNameZh]);

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
              <div>{departureStopNameZh}</div>
              <div>－</div>
              <div>{destinationStopNameZh}</div>
              <div>｜</div>
              <div>{directionStops.length}站</div>
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
                to={`${path.certainRoute}?lng=${lng}&lat=${lat}&stationID=${stationID}&routeName=${routeName}&routeUID=${routeUID}&direction=${stop.direction}&departureStopNameZh=${departureStopNameZh}&destinationStopNameZh=${destinationStopNameZh}`}
                className={
                  stop.direction == direction
                    ? `${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button} ${styles.buttonBox_buttonFocus}`
                    : `${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`
                }
                key={`${stop.routeUID}-${index}`}
              >
                {stop.direction
                  ? `往${departureStopNameZh}`
                  : `往${destinationStopNameZh}`}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.topBox_padding}>
          <div
            className={`${styles.box__alignItemsCenter} ${styles.box__start} ${styles.certainRouteBox_titleBox}`}
          ></div>
          <div
            className={`${styles.box__alignItemsCenter} ${styles.certainRouteBox_routeInfo} ${styles.box__spaceBetween}`}
          ></div>
        </div>
      )}
      {directionStops && directionStops.length > 0 ? (
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
                        <div key={`${bus.plateNumb}-${direction}`}>
                          {bus.plateNumb}
                        </div>
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
