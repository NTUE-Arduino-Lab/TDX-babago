import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import useDynamicRefs from 'use-dynamic-refs';

import path from '../../router/path';
import styles from './styles.module.scss';

// eslint-disable-next-line no-unused-vars
import { setNearbyStops, setSelectStopIndex } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function HomeNearbyStopsBox() {
  const [getRef, setRef] = useDynamicRefs();
  const [OverSize, SetOverSize] = useState([]);

  const [frontNearbyStops, SetFrontNearbyStops] = useState([]);
  const {
    state: { position, nearbyStops },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    if (position) {
      setNearbyStops(dispatch, { lng: position.lng, lat: position.lat });
    }
  }, [position]);

  useEffect(() => {
    if (nearbyStops) {
      if (nearbyStops.length > 5) {
        const array = [];
        for (var i = 0; i < 5; i++) {
          array.push(nearbyStops[i]);
        }
        SetFrontNearbyStops(array);
      } else {
        SetFrontNearbyStops(nearbyStops);
      }
    }
  }, [nearbyStops]);

  useEffect(() => {
    if (frontNearbyStops.length > 0) {
      const array = [];
      frontNearbyStops.map((el) => {
        var p_ref = getRef(el.stationName + '_p');
        var div_ref = getRef(el.stationName + '_div');
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
    <div className={styles.sidebar_box}>
      <div
        className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.nearbyBox__marginBottom}`}
      >
        <div className={styles.linkRow__fontSize}>附近站牌</div>
        <Link to={path.nearbyStops}>
          <FontAwesomeIcon
            className={styles.linkRow_arrowIcon}
            icon={faArrowRight}
          />
        </Link>
      </div>
      {nearbyStops ? (
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
                      OverSize[index] ? `${styles.marquee_animation}` : ''
                    }
                  >
                    {nearbyStop.stationName}
                  </p>
                </div>
                {/* <div className={styles.stopInfoBox_stopDistance__fontSize}>
                  {nearbyStop.stationDistance} 公尺
                </div> */}
              </div>
              <div
                className={`${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.nearbyBox__marginBottom}`}
              >
                <div className={styles.routeStopBox_routeNameBox}>
                  {nearbyStop.routes.map((routeName, index) => (
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
                  to={path.certainStop}
                  state={{ clickStopIndex: index }}
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
  );
}

export default HomeNearbyStopsBox;
