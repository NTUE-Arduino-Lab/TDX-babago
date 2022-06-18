import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import cityJson from '../../asset/json/city.json';

import {
  setCurrentBuses,
  setSelectRouteStopsSort,
  setSelectRouteStopsTime,
  setSelectRouteBuses,
  setRemindBuses,
  setReserveBus,
  setVehicle,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBus,
  faArrowAltCircleRight,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
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
      remindBuses,
      reserveBus,
      vehicle,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);
  const [stopsArr, setStopsArr] = useState(null);
  const [stopsTimeArr, setStopsTimeArr] = useState(null);
  const [routeBusesArr, setRouteBusesArr] = useState(null);
  const [directionStops, setDirectionStops] = useState(null);
  const [pageUpdate, setPageUpdate] = useState(true);
  const [city, setCity] = useState(null);

  useEffect(() => {
    setCurrentBuses(dispatch, {
      city: null,
      stationID: null,
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageUpdate(!pageUpdate);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [pageUpdate]);

  useEffect(() => {
    for (let i = 0; i < cityJson.length; i++) {
      if (cityJson[i].AuthorityCode === routeUID.substring(0, 3)) {
        if (!city) {
          setCity(cityJson[i].cityEn);
        } else if (!vehicle[city]) {
          setVehicle(dispatch, {
            vehicle,
            cityEn: cityJson[i].cityEn,
          });
        } else if (routeName && routeUID) {
          setSelectRouteStopsSort(dispatch, {
            selectRoute: {
              routeName,
              routeUID,
            },
          });
        }
        i == cityJson.length;
      }
    }
  }, [routeName, routeUID, pageUpdate, city && vehicle[city]]);

  useEffect(() => {
    if (selectRouteStopsSort) {
      const selectRouteStopsSort2 = [...selectRouteStopsSort];
      for (let i = 0; i < selectRouteStopsSort2.length; i++) {
        if (selectRouteStopsSort2[i].direction == direction) {
          setStopsArr(selectRouteStopsSort2[i].stops);
          i = selectRouteStopsSort2.length;
        }
      }
    }
  }, [selectRouteStopsSort, direction]);

  useEffect(() => {
    if (stopsArr) {
      setSelectRouteStopsTime(dispatch, {
        selectRoute: {
          routeName,
          routeUID,
        },
      });
    }
  }, [stopsArr]);

  useEffect(() => {
    if (selectRouteStopsTime && stopsArr && stopsArr.length > 0) {
      let stopsTimeArr2 = [];
      const selectRouteStopsTime2 = [...selectRouteStopsTime];
      for (let i = 0; i < stopsArr.length; i++) {
        for (let j = 0; j < selectRouteStopsTime2.length; j++) {
          if (
            selectRouteStopsTime2[j].direction == direction &&
            stopsArr[i].StopUID == selectRouteStopsTime2[j].stopUID
          ) {
            stopsTimeArr2.push({
              stopUID: stopsArr[i].StopUID,
              // stationID: stopsArr[i].StationID,
              stopPosition: stopsArr[i].StopPosition,
              stopName: stopsArr[i].StopName,
              stopBoarding: stopsArr[i].StopBoarding,
              stopStatus:
                Math.round(selectRouteStopsTime2[j].estimateTime / 60) <= 1
                  ? '進站中'
                  : Math.round(selectRouteStopsTime2[j].estimateTime / 60) > 1
                  ? `${Math.round(
                      selectRouteStopsTime2[j].estimateTime / 60,
                    )} 分`
                  : selectRouteStopsTime2[j].stopStatus == 4
                  ? '今日未營運'
                  : selectRouteStopsTime2[j].stopStatus == 3
                  ? '末班車已過'
                  : selectRouteStopsTime2[j].stopStatus == 2
                  ? '交管不停靠'
                  : '尚未發車',
              remindState: false,
              buses: [],
              // busEstimateTime: selectRouteStopsTime[j].estimateTime,
              // busPlateNumb: selectRouteStopsTime[j].plateNumb,
            });
            j = selectRouteStopsTime2.length - 1;
          }
          if (
            i == stopsArr.length - 1 &&
            j == selectRouteStopsTime2.length - 1
          ) {
            if (remindBuses.length > 0) {
              let remindBusesArray = new Array(stopsTimeArr2.length).fill(
                false,
              );
              for (let i = 0; i < remindBuses.length; i++) {
                if (
                  remindBuses[i].routeUID == routeUID &&
                  remindBuses[i].direction == direction
                ) {
                  for (let j = 0; j < stopsTimeArr2.length; j++) {
                    if (
                      remindBuses[i].stationName ==
                      stopsTimeArr2[j].stopName.Zh_tw
                    ) {
                      remindBusesArray[j] = true;
                    }
                  }
                }
              }
              for (let i = 0; i < stopsTimeArr2.length; i++) {
                stopsTimeArr2[i].remindState = remindBusesArray[i];
                if (
                  reserveBus &&
                  !reserveBus.stationID &&
                  reserveBus.routeUID == routeUID &&
                  reserveBus.direction == direction &&
                  reserveBus.stationName == stopsTimeArr2[i].stopName.Zh_tw
                ) {
                  stopsTimeArr2[i].reverseState = true;
                } else {
                  stopsTimeArr2[i].reverseState = false;
                }
              }
            } else {
              for (let i = 0; i < stopsTimeArr2.length; i++) {
                if (
                  reserveBus &&
                  !reserveBus.stationID &&
                  reserveBus.routeUID == routeUID &&
                  reserveBus.direction == direction &&
                  reserveBus.stationName == stopsTimeArr2[i].stopName.Zh_tw
                ) {
                  stopsTimeArr2[i].reverseState = true;
                } else {
                  stopsTimeArr2[i].reverseState = false;
                }
              }
            }
            setStopsTimeArr(stopsTimeArr2);
          }
        }
      }
    }
  }, [selectRouteStopsTime, remindBuses.length, reserveBus]);

  useEffect(() => {
    if (stopsTimeArr) {
      setSelectRouteBuses(dispatch, {
        selectRoute: {
          routeName,
          routeUID,
        },
      });
    }
  }, [stopsTimeArr]);

  useEffect(() => {
    if (selectRouteBuses) {
      const selectRouteBuses2 = [...selectRouteBuses];
      if (selectRouteBuses2.length > 0) {
        let routeBusesArr2 = [];
        for (let i = 0; i < selectRouteBuses2.length; i++) {
          if (selectRouteBuses2[i].direction == direction) {
            routeBusesArr2.push(selectRouteBuses2[i]);
          }
          if (i == selectRouteBuses2.length - 1) {
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
  }, [selectRouteBuses]);

  useEffect(() => {
    if (stopsTimeArr && stopsTimeArr.length > 0 && routeBusesArr) {
      if (routeBusesArr == -1) {
        setDirectionStops(stopsTimeArr);
      } else if (routeBusesArr.length > 0) {
        let directionStops2 = stopsTimeArr;
        let routeBusesArr2 = routeBusesArr;

        for (let i = 0; i < stopsTimeArr.length; i++) {
          for (let j = 0; j < routeBusesArr2.length; j++) {
            if (
              stopsTimeArr[i].stopUID == routeBusesArr2[j].stopUID &&
              vehicle &&
              vehicle[city]
            ) {
              let index = i;
              if (!routeBusesArr2[j].a2EventType && i < stopsTimeArr.length) {
                index = i + 1;
              }

              const found = vehicle[city].find(
                (element) => element.PlateNumb == routeBusesArr2[j].plateNumb,
              );
              if (found) {
                directionStops2[index].buses.push({
                  plateNumb: routeBusesArr2[j].plateNumb,
                  busStatus: routeBusesArr2[j].busStatus,
                  dutyStatus: routeBusesArr2[j].dutyStatus,
                  stopSequence: routeBusesArr2[j].stopSequence,
                  vehicleType: found.VehicleType,
                });
              } else {
                // 暫定
                directionStops2[index].buses.push({
                  plateNumb: routeBusesArr2[j].plateNumb,
                  busStatus: routeBusesArr2[j].busStatus,
                  dutyStatus: routeBusesArr2[j].dutyStatus,
                  stopSequence: routeBusesArr2[j].stopSequence,
                  vehicleType: 0,
                });
              }
            }
            if (i == stopsTimeArr.length - 1 && j == routeBusesArr.length - 1) {
              setDirectionStops(directionStops2);
            }
          }
        }
      }
    }
  }, [routeBusesArr]);

  useEffect(() => {
    // console.log(directionStops);
  }, [directionStops, departureStopNameZh, destinationStopNameZh]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      {directionStops &&
      selectRouteStopsSort &&
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
              <div>路線資訊</div>
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
                  {!stop.reverseState ? (
                    <button
                      className={`${styles.ButtonBox_Button} ${styles.Button_openButton} ${styles.box__alignItemsCenter}`}
                      onClick={() => {
                        setReserveBus(dispatch, {
                          bus: {
                            direction,
                            routeUID,
                            routeName,
                            stopStatus: stop.stopStatus,
                            departureStopNameZh,
                            destinationStopNameZh,
                            stationName: stop.stopName.Zh_tw,
                          },
                        });
                      }}
                    >
                      <FontAwesomeIcon
                        className={styles.Button_icon}
                        icon={faBus}
                      />
                      <div>預約下車</div>
                    </button>
                  ) : (
                    <button
                      className={`${styles.ButtonBox_Button} ${styles.Button_cancelButton} ${styles.box__alignItemsCenter}`}
                      onClick={() => {
                        setReserveBus(dispatch, {
                          bus: null,
                        });
                      }}
                    >
                      <FontAwesomeIcon
                        className={styles.ButtonBox_icon}
                        icon={faBus}
                      />
                      <div>取消預約</div>
                    </button>
                  )}
                  {!stop.remindState ? (
                    <button
                      className={`${styles.ButtonBox_Button} ${styles.Button_openButton} ${styles.box__alignItemsCenter}`}
                      onClick={() => {
                        let busesArr = [...remindBuses];
                        busesArr.push({
                          stationName: stop.stopName.Zh_tw,
                          routeUID,
                          routeName,
                          direction,
                          stopStatus: stop.stopStatus,
                          departureStopNameZh,
                          destinationStopNameZh,
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
                      className={`${styles.ButtonBox_Button} ${styles.Button_cancelButton} ${styles.box__alignItemsCenter}`}
                      onClick={() => {
                        let busesArr = [...remindBuses];
                        for (let i = 0; i < busesArr.length; i++) {
                          if (
                            busesArr[i].direction == direction &&
                            busesArr[i].routeUID == routeUID &&
                            busesArr[i].stationName == stop.stopName.Zh_tw
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
                        icon={faBell}
                      />
                      <div>取消提醒</div>
                    </button>
                  )}
                  <div
                    className={`${styles.ButtonBox_Button} ${styles.Button_openButton} ${styles.box__alignItemsCenter}`}
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
                    <div className={`${styles.stopCircle_plateNumb}`}>
                      {stop.buses.map((bus, index) => (
                        <div key={`${bus.plateNumb}-${index}-${direction}`}>
                          <div className={styles.box__center}>
                            {bus.vehicleType == 1 || bus.vehicleType == 2 ? (
                              <div
                                className={
                                  index == 0 && index == stop.buses.length - 1
                                    ? `${styles.plateNumb_icon} ${styles.icon_topLeft_radius} ${styles.icon_bottomLeft_radius}`
                                    : index == 0
                                    ? `${styles.plateNumb_icon} ${styles.icon_topLeft_radius}`
                                    : index == stop.buses.length - 1
                                    ? `${styles.plateNumb_icon} ${styles.icon_bottomLeft_radius}`
                                    : styles.plateNumb_icon
                                }
                              >
                                <FontAwesomeIcon icon={farBell} />
                              </div>
                            ) : (
                              <></>
                            )}
                            <div className={styles.plateNumb_text}>
                              {bus.plateNumb}
                            </div>
                          </div>
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
