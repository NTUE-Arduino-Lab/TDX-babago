import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';
import useDynamicRefs from 'use-dynamic-refs';

import path from '../../router/path';
import styles from './styles.module.scss';

// eslint-disable-next-line no-unused-vars
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function HomeNearbyStopsBox() {
  const [getRef, setRef] = useDynamicRefs();
  const [overSize, SetOverSize] = useState([]);

  const reactlocation = useLocation();
  const { lng, lat } = QueryString.parse(reactlocation.search);

  const {
    state: {
      nearbyStops,
      // requestdata: { loading },
    },
  } = useContext(StoreContext);
  const [frontNearbyStops, setFrontNearbyStops] = useState([]);

  useEffect(() => {
    if (nearbyStops) {
      // console.log(nearbyStops);

      const nearbyStops2 = [...nearbyStops];
      let frontNearbyStopsLength = 5;
      if (nearbyStops2.length < 5) {
        frontNearbyStopsLength = nearbyStops2.length;
      }
      const array = [];

      for (let i = 0; i < frontNearbyStopsLength; i++) {
        const routes = [];
        for (let j = 0; j < nearbyStops2[i].stationIDs.length; j++) {
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
          stationRoutes: routes,
        });
      }
      setFrontNearbyStops(array);
    }
  }, [nearbyStops]);

  useEffect(() => {
    if (frontNearbyStops.length > 0) {
      const array = [];
      frontNearbyStops.map((el) => {
        const p_ref = getRef(el.stationName + '_p');
        const div_ref = getRef(el.stationName + '_div');
        if (p_ref !== null && p_ref !== undefined) {
          if (
            div_ref.current !== null &&
            p_ref.current !== null &&
            p_ref.current.offsetWidth > div_ref.current.offsetWidth
          ) {
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
                <div
                  ref={setRef(nearbyStop.stationName + '_div')}
                  className={styles.stopInfoBox_stopName}
                >
                  <p
                    ref={setRef(nearbyStop.stationName + '_p')}
                    className={
                      overSize[index] ? `${styles.marquee_animation}` : ''
                    }
                  >
                    {nearbyStop.stationName}
                  </p>
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
