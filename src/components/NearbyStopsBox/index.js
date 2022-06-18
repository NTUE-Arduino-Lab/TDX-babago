import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import { setCurrentBuses } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons';

function NearbyStopsBox() {
  const reactlocation = useLocation();
  const { lng, lat } = QueryString.parse(reactlocation.search);

  const {
    state: {
      location,
      nearbyStops,
      // requestdata: { loading },
    },
    dispatch,
  } = useContext(StoreContext);

  const [nearbyStopsName, setNearbyStopsName] = useState(null);
  const [stationCount, setStationCount] = useState(0);

  useEffect(() => {
    setCurrentBuses(dispatch, {
      city: null,
      stationID: null,
    });
  }, []);

  useEffect(() => {
    if (nearbyStops) {
      const nearbyStops2 = [...nearbyStops];
      const array = [];
      let count = 0;

      for (let i = 0; i < nearbyStops2.length; i++) {
        const routes = [];
        for (let j = 0; j < nearbyStops2[i].stationIDs.length; j++) {
          count++;
          for (
            let k = 0;
            k < nearbyStops2[i].stationIDs[j].stationStops.length;
            k++
          ) {
            for (
              let l = 0;
              l < nearbyStops2[i].stationIDs[j].stationStops[k].routes.length;
              l++
            ) {
              let flag = true;
              for (let m = 0; m < routes.length; m++) {
                if (
                  routes[m] ==
                  nearbyStops2[i].stationIDs[j].stationStops[k].routes[l]
                ) {
                  flag = false;
                  m = routes.length;
                }
              }
              if (flag) {
                routes.push(
                  nearbyStops2[i].stationIDs[j].stationStops[k].routes[l],
                );
              }
            }
          }
        }

        array.push({
          stationName: nearbyStops2[i].stationName,
          stationID: nearbyStops2[i].stationIDs[0].stationID,
          stationDistance: nearbyStops2[i].stationIDs[0].stationDistance,
          stationRoutes: routes,
        });
      }

      setStationCount(count);
      setNearbyStopsName(array);
    }
  }, [nearbyStops]);

  useEffect(() => {
    // console.log(nearbyStopsName);
  }, [location, stationCount, nearbyStopsName]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      <div className={styles.nearbyBox_titleBox}>
        <div>附近站牌</div>
        {location && stationCount ? (
          <div className={styles.titleBox_stopsInfo}>
            <div>{location.city}</div>
            <div>{location.town}</div>
            <div>｜</div>
            <div>{stationCount}站</div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {nearbyStopsName && nearbyStopsName.length > 0 ? (
        <div className={styles.nearbyBox_AllStopBox}>
          {nearbyStopsName.map((nearbyStop, index) => (
            <div className={styles.nearbyBox_certainStopBox} key={index}>
              <Link
                to={`${path.certainStop}?lng=${lng}&lat=${lat}&stationName=${nearbyStop.stationName}&stationID=${nearbyStop.stationID}&stationDistance=${nearbyStop.stationDistance}`}
                className={styles.certainStopBox_linkSetting}
              >
                <div className={styles.certainStopBox_frontBox}>
                  <div
                    className={`${styles.routeStopBox_stopInfoBox} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
                  >
                    <div className={styles.stopInfoBox_stopName__fontSize}>
                      {nearbyStop.stationName}
                    </div>
                    <FontAwesomeIcon
                      className={styles.linkRow_arrowIcon}
                      icon={faArrowRight}
                    />
                    {/* <div className={styles.stopInfoBox_stopDistance__fontSize}>
                      {nearbyStop.stationDistance} 公尺
                    </div> */}
                  </div>
                  <div
                    className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
                  >
                    <div className={styles.routeStopBox_routeNameBox}>
                      {nearbyStop.stationRoutes.map((routeName, index) => (
                        <div key={index}>
                          <div
                            className={`${styles.routeNameBox_routeName} ${styles.linkRow__fontSize} ${styles.box__alignItemsCenter}`}
                          >
                            {routeName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : nearbyStopsName && nearbyStopsName.length == 0 ? (
        <div className={styles.nearbyBox_noInfoBox}>
          <div className={styles.box__center}>
            <div className={styles.nearbyBox_noInfoImg}></div>
          </div>
          <div className={styles.box__center}>
            <div className={styles.nearbyBox_noInfoText}>
              您的周圍沒有 附近站牌
            </div>
          </div>
          <div className={styles.box__center}>
            <button
              className={`${styles.findStop_Button} ${styles.box__alignItemsCenter}`}
            >
              <FontAwesomeIcon className={styles.Button_icon} icon={faSearch} />
              <div>查看最近站牌</div>
            </button>
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

export default NearbyStopsBox;
