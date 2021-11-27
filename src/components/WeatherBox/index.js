import React, { useEffect, useContext } from 'react';
import moment from 'moment';
import styles from './styles.module.scss';

import { setWeather } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

function WeatherBox() {
  const {
    state: { location, weather },
    dispatch,
  } = useContext(StoreContext);

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

  useEffect(() => {}, [weather]);

  return (
    <div
      className={`${styles.sidebar_box} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.sidebar_weatherBox__paddingBottom}`}
    >
      {weather ? (
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
  );
}

export default WeatherBox;
