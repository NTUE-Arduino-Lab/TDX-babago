import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import WeatherBox from '../../components/WeatherBox';
import NearbyStopsBox from '../../components/NearbyStopsBox';

function NearbyStops() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <WeatherBox></WeatherBox>
        <NearbyStopsBox></NearbyStopsBox>
      </div>
    </Fragment>
  );
}

export default NearbyStops;
