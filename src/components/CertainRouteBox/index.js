import React from 'react';
import { useLocation } from 'react-router-dom';
// import React, { useEffect, useContext } from 'react';

import styles from './styles.module.scss';

import cityJson from '../../asset/json/city.json';

// import { setNearbyStops, setSelectStopIndex } from '../../store/actions';
// import { StoreContext } from '../../store/reducer';
function CertainRouteBox() {
  const reactlocation = useLocation();
  var { clickRouteName } = reactlocation.state;
  // const {
  //   state: { position, nearbyStops },
  //   dispatch,
  // } = useContext(StoreContext);

  // useEffect(() => {
  //   if (position) {
  //     setNearbyStops(dispatch, { lng: position.lng, lat: position.lat });
  //   }
  // }, [position]);

  return (
    <div className={styles.sidebar_box}>
      <div className={styles.topBox_padding}>
        <div
          className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.certainRouteBox_titleBox}`}
        >
          {clickRouteName}
        </div>
        <div
          className={`${styles.certainRouteBox_buttonBox} ${styles.box__spaceBetween}`}
        >
          <div
            className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`}
          >
            往大直
          </div>
          <div
            className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.buttonBox_button}`}
          >
            往麟光捷運站
          </div>
        </div>
      </div>
      <div
        className={`${styles.bottomBox_padding} ${styles.box__spaceBetween}`}
      >
        <div className={styles.certainRouteBox_routeStopBox}>
          {cityJson.map((city) => (
            <div className={styles.routeStopBox_stopInfoBox} key={city}>
              <div
                className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_busStatus}`}
              >
                {/* 43 分 */}
                {city.city}
              </div>
              <div
                className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.stopInfoBox_stopName}`}
              >
                {/* 大我新舍 */}
                {city.cityEn}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.certainRouteBox_routeDotBox}>
          <div className={styles.routeDotBox_routeLine}></div>
          {cityJson.map((city) => (
            <div
              className={`${styles.box__alignItemsCenter} ${styles.box__center} ${styles.routeDotBox_stopCircleBox}`}
              key={city}
            >
              <div className={styles.stopCircleBox_stopCircle}>
                {/* {city.cityEn} */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CertainRouteBox;
