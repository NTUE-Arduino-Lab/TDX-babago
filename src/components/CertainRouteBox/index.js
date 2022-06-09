import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './styles.module.scss';

// import cityJson from '../../asset/json/city.json';

import { setNearbyStops, setSelectRouteStops } from '../../store/actions';
import { StoreContext } from '../../store/reducer';
function CertainRouteBox() {
  const reactlocation = useLocation();
  var { currentRoutesBus, frontCertainRoute } = reactlocation.state;
  const [directionStops, setDirectionStops] = useState([]);
  const [changeLocation, setChangeLocation] = useState(null);
  const [selectRouteDirection, setSelectRouteDirection] = useState(null);
  const {
    state: { position, location, selectRouteStops },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    // console.log('certainPage: ' + clickStopIndex);
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
    if (location && currentRoutesBus) {
      setSelectRouteStops(dispatch, {
        city: location.city,
        selectRoute: currentRoutesBus,
      });
    }
  }, [location, currentRoutesBus]);

  useEffect(() => {
    setSelectRouteDirection(currentRoutesBus.direction);
  }, [currentRoutesBus]);

  useEffect(() => {
    if (selectRouteStops && selectRouteDirection != null) {
      for (var i = 0; i < selectRouteStops.length; i++) {
        if (selectRouteStops[i].direction == selectRouteDirection) {
          setDirectionStops(selectRouteStops[i].stops);
        }
      }
    }
  }, [selectRouteStops, selectRouteDirection]);

  useEffect(() => {}, [directionStops]);

  return (
    <div className={styles.sidebar_box}>
      {selectRouteStops && directionStops ? (
        <>
          <div className={styles.topBox_padding}>
            <div
              className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.certainRouteBox_titleBox}`}
            >
              {currentRoutesBus.routeName}
            </div>
            <div
              className={`${styles.certainRouteBox_buttonBox} ${styles.box__spaceBetween}`}
            >
              {selectRouteStops.map((stop, index) => (
                <button
                  className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`}
                  onClick={() => {
                    setSelectRouteDirection(stop.direction);
                  }}
                  key={`${stop.routeUID}-${index}`}
                >
                  {stop.direction
                    ? frontCertainRoute.departureStopNameZh
                    : frontCertainRoute.destinationStopNameZh}
                </button>
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
                >
                  <div
                    className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_busStatus}`}
                  >
                    43 分
                  </div>
                  <div
                    className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_stopName}`}
                  >
                    {stop.StopName.Zh_tw}
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
