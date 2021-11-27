import React, { useEffect, useContext } from 'react';
import moment from 'moment';
import styles from './styles.module.scss';

// import nearbyInfoJson from '../../asset/json/nearbyInfo.json';
// import closestInfoJson from '../../asset/json/closestInfo.json';

import {
  setNearbyStops,
  setWeather,
  setCertainRoutes,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';

function Sidebar() {
  const {
    state: { position, location, weather, nearbyStops, certainRoutes },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    if (position) {
      setNearbyStops(dispatch, { lng: position.lng, lat: position.lat });
    }
  }, [position]);

  useEffect(() => {
    if (location) {
      const now = new Date();
      const nowString = moment(now).format('YYYY-MM-DDTHH:MM:SS');
      const next = now.setDate(now.getDate() + 1);
      const nextString = moment(next).format('YYYY-MM-DDTHH:MM:SS');
      // console.log(nowString);
      // console.log(nextString);

      setWeather(dispatch, {
        city: location.city,
        town: location.town,
        timeFrom: nowString,
        timeTo: nextString,
      });
    }
  }, [location]);

  useEffect(() => {
    if (nearbyStops && location) {
      setCertainRoutes(dispatch, {
        city: location.city,
        stationID: nearbyStops[0].stationID,
      });
    }
  }, [nearbyStops, location]);

  useEffect(() => {}, [certainRoutes]);

  return (
    <div className={styles.sidebar}>
      <div className={`${styles.sidebar_nav} ${styles.box__spaceBetween}`}>
        <div className={styles.nav_logo}></div>
        <div className={styles.nav_buttonBox}>
          <div className={styles.buttonBox_button}>
            <div className={styles.button_icon}></div>
          </div>
          <div className={styles.buttonBox_button}>
            <div className={styles.button_icon}></div>
          </div>
        </div>
      </div>

      <div className={styles.sidebar_searchBar}>
        <div className={styles.searchBar_icon}></div>
        <div
          className={`${styles.searchBar_inputBox} ${styles.box__alignItemsCenter}`}
        >
          <input
            className={styles.inputBox_text}
            type="text"
            placeholder="搜尋車站或站牌名稱"
          />
        </div>
      </div>

      <div
        className={`${styles.sidebar_box} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.sidebar_weatherBox__paddingBottom}`}
      >
        {location && weather ? (
          <>
            <div className={styles.weatherBox_leftInfoBox}>
              <div
                className={`${styles.leftInfoBox__marginBottom} ${styles.box__alignItemsCenter}`}
              >
                <div className={styles.leftInfoBox_locationIcon}></div>
                <div className={styles.leftInfoBox_locationText}>
                  {location.city}
                </div>
                <div className={styles.leftInfoBox_locationText}>
                  {location.town}
                </div>
              </div>
              <div className={styles.box__alignItemsCenter}>
                <div
                  className={`${styles.leftInfoBox__marginRight} ${styles.box__alignItemsCenter}`}
                >
                  <div className={styles.leftInfoBox_smallText}>降雨率</div>
                  <div className={styles.leftInfoBox_smallText}>
                    {weather.rainRate} %
                  </div>
                </div>
                <div className={styles.box__alignItemsCenter}>
                  <div className={styles.leftInfoBox_smallText}>
                    {weather.minTemp} ˚C
                  </div>
                  <div className={styles.leftInfoBox_smallText}>/</div>
                  <div className={styles.leftInfoBox_smallText}>
                    {weather.maxTemp} ˚C
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.box__alignItemsCenter}>
              <div className={styles.rightInfoBox_currentTemp}>
                {weather.currentTemp} ˚C
              </div>
              <div className={styles.rightInfoBox_weatherIcon}></div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className={styles.sidebar_box}>
        <div
          className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.closestBox_titlebox__marginBottom}`}
        >
          <div className={styles.linkRow__fontSize}>最近站牌</div>
          <div className={styles.linkRow_arrowIcon}></div>
        </div>
        <div
          className={`${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
        >
          {nearbyStops ? (
            <>
              <div className={styles.closestBox_stopName}>
                {nearbyStops[0].stationName}
              </div>
              <div className={styles.closestBox_stopDistance__fontSize}>
                {nearbyStops[0].stationDistance} 公尺
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        {certainRoutes ? (
          <>
            {certainRoutes.map((certainRoute, index) => (
              <div
                className={`${styles.closestBox_currentInfoBox} ${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter}`}
                key={index}
              >
                <div className={styles.currentInfoBox_routeName}>
                  {certainRoute.routeName}
                </div>
                <div className={styles.currentInfoBox_routeDirection}>
                  {certainRoute.routeID}
                </div>
                <div className={styles.currentInfoBox_routeState}>
                  {certainRoute.stopStatus}
                </div>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>

      <div className={styles.sidebar_box}>
        <div
          className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.nearbyBox__marginBottom}`}
        >
          <div className={styles.linkRow__fontSize}>附近站牌</div>
          <div className={styles.linkRow_arrowIcon}></div>
        </div>
        {nearbyStops ? (
          <>
            {nearbyStops.map((nearbyStop, index) => (
              <div className={styles.nearbyBox__marginBottom} key={index}>
                <div
                  className={`${styles.routeStopBox_routeNameBox} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
                >
                  <div className={styles.stopInfoBox_stopName__fontSize}>
                    {nearbyStop.stationName}
                  </div>
                  <div className={styles.stopInfoBox_stopDistance__fontSize}>
                    {nearbyStop.stationDistance} 公尺
                  </div>
                </div>
                <div
                  className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
                >
                  <div className={styles.routeStopBox_routeNameBox}>
                    {nearbyStop.routes.map((routeName, index) => (
                      <div key={index}>
                        <div
                          className={`${styles.routeNameBox_routeName} ${styles.linkRow__fontSize}`}
                        >
                          {routeName}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.linkRow_arrowIcon}></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
