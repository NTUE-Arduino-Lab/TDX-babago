import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function NearbyStopsBox() {
  const reactlocation = useLocation();
  const { lng, lat } = QueryString.parse(reactlocation.search);
  const [nearbyStopsName, setNearbyStopsName] = useState([]);
  const [stationCount, setStationCount] = useState(0);
  const {
    state: {
      location,
      nearbyStops,
      // requestdata: { loading },
    },
  } = useContext(StoreContext);

  // useEffect(() => {
  //   // console.log('certainPage: ' + stationID);
  //   if (nearbyStops && stationID && stationName) {
  //     for (var i = 0; i < nearbyStops.length; i++) {
  //       if (stationName == nearbyStops[i].stationName) {
  //         for (var j = 0; j < nearbyStops[i].stationStops.length; j++) {
  //           if (stationID == nearbyStops[i].stationStops[j].stationID) {
  //             setCertainStop(nearbyStops[i].stationStops[j]);
  //             j = nearbyStops[i].stationStops.length;
  //           }
  //         }
  //         i = nearbyStops.length;
  //       }
  //     }
  //   }
  // }, [nearbyStops, stationID, stationName]);

  useEffect(() => {
    if (nearbyStops) {
      let array = [];
      let count = [];

      for (var i = 0; i < nearbyStops.length; i++) {
        let routes = [];
        for (var j = 0; j < nearbyStops[i].stationIDs.length; j++) {
          count++;
          for (
            var k = 0;
            k < nearbyStops[i].stationIDs[j].stationStops.length;
            k++
          ) {
            for (
              var l = 0;
              l < nearbyStops[i].stationIDs[j].stationStops[k].routes.length;
              l++
            ) {
              let flag = true;
              for (var m = 0; m < routes.length; m++) {
                if (
                  routes[m] ==
                  nearbyStops[i].stationIDs[j].stationStops[k].routes[l]
                ) {
                  flag = false;
                  m = routes.length;
                }
              }
              if (flag) {
                routes.push(
                  nearbyStops[i].stationIDs[j].stationStops[k].routes[l],
                );
              }
            }
          }
        }

        array.push({
          stationName: nearbyStops[i].stationName,
          stationID: nearbyStops[i].stationIDs[0].stationID,
          stationDistance: nearbyStops[i].stationIDs[0].stationDistance,
          stationRoutes: routes,
        });
      }

      setStationCount(count);
      setNearbyStopsName(array);
    }
  }, [nearbyStops]);

  useEffect(() => {
    // console.log(nearbyStopsName);
  }, [location, nearbyStopsName, stationCount]);

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
      {nearbyStopsName.length > 0 ? (
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
      ) : (
        <></>
      )}
    </div>
    //   )}
    // </>
  );
}

export default NearbyStopsBox;
