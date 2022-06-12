import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function NearbyStopsBox() {
  const [nearbyStopsName, setNearbyStopsName] = useState([]);
  const {
    state: {
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

      for (var i = 0; i < nearbyStops.length; i++) {
        let routes = [];
        for (var j = 0; j < nearbyStops[i].stationStops.length; j++) {
          for (
            var k = 0;
            k < nearbyStops[i].stationStops[j].routes.length;
            k++
          ) {
            let flag = true;
            for (var l = 0; l < routes.length; l++) {
              if (routes[l] == nearbyStops[i].stationStops[j].routes[k]) {
                flag = false;
                l = routes.length;
              }
            }
            if (flag) {
              routes.push(nearbyStops[i].stationStops[j].routes[k]);
            }
          }
        }
        array.push({
          stationName: nearbyStops[i].stationName,
          stationRoutes: routes,
        });
      }
      setNearbyStopsName(array);
    }
  }, [nearbyStops]);

  useEffect(() => {
    console.log(nearbyStopsName);
  }, [nearbyStopsName]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      <div className={styles.nearbyBox_titleBox}>
        <div>附近站牌</div>
        <div className={styles.titleBox_stopsInfo}>
          <div>台北市</div>
          <div>大安區</div>
          <div>｜</div>
          <div>6站</div>
        </div>
      </div>
      {nearbyStopsName.length > 0 ? (
        <div className={styles.nearbyBox_AllStopBox}>
          {nearbyStopsName.map((nearbyStop, index) => (
            <div className={styles.nearbyBox_certainStopBox} key={index}>
              <Link
                to={`${path.certainStop}?clickStopIndex=${index}`}
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
