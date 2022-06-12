import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

// eslint-disable-next-line no-unused-vars
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function HomeNearbyStopsBox() {
  const reactlocation = useLocation();
  var { lng, lat } = QueryString.parse(reactlocation.search);
  const [frontNearbyStops, setFrontNearbyStops] = useState([]);
  const {
    state: {
      nearbyStops,
      // requestdata: { loading },
    },
  } = useContext(StoreContext);

  useEffect(() => {
    if (nearbyStops) {
      // console.log(nearbyStops);

      let frontNearbyStopsLength = 5;
      if (nearbyStops.length < 5) {
        frontNearbyStopsLength = nearbyStops.length;
      }
      let array = [];

      for (var i = 0; i < frontNearbyStopsLength; i++) {
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
      setFrontNearbyStops(array);
    }
  }, [nearbyStops]);

  useEffect(() => {
    // if (frontNearbyStops) {
    //   console.log(frontNearbyStops);
    // }
  }, [frontNearbyStops]);

  return (
    // <>
    //   {loading ? (
    //     <></>
    //   ) : (
    <div className={styles.sidebar_box}>
      <div
        className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.nearbyBox__marginBottom}`}
      >
        <div className={styles.linkRow__fontSize}>附近站牌</div>
        <Link to={`${path.nearbyStops}?lng=${lng}&lat=${lat}`}>
          <FontAwesomeIcon
            className={styles.linkRow_arrowIcon}
            icon={faArrowRight}
          />
        </Link>
      </div>
      {frontNearbyStops ? (
        <>
          {frontNearbyStops.map((nearbyStop, index) => (
            <div className={styles.nearbyBox__marginBottom} key={index}>
              <div
                className={`${styles.routeStopBox_stopInfoBox} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
              >
                <div className={styles.stopInfoBox_stopName__fontSize}>
                  {nearbyStop.stationName}
                </div>
              </div>
              <div
                className={`${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.nearbyBox__marginBottom}`}
              >
                <div className={styles.routeStopBox_routeNameBox}>
                  {nearbyStop.stationRoutes.map((routeName, index) => (
                    <div key={index}>
                      <div
                        className={`${styles.routeNameBox_routeName} ${styles.box__alignItemsCenter}`}
                      >
                        {routeName}
                      </div>
                    </div>
                  ))}
                </div>
                {/* <Link
                  to={`${path.certainStop}?clickStopIndex=${index}`}
                  onClick={() => setSelectStopIndex(dispatch, { index: index })}
                >
                  <FontAwesomeIcon
                    className={styles.linkRow_arrowIcon}
                    icon={faArrowRight}
                  />
                </Link> */}
              </div>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
    //   )}
    // </>
  );
}

export default HomeNearbyStopsBox;
