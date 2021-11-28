import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import WeatherBox from '../../components/WeatherBox';
import NearbyBox from '../../components/NearbyBox';

function Nearby() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <WeatherBox></WeatherBox>
        <NearbyBox></NearbyBox>
      </div>
    </Fragment>
  );
}

export default Nearby;
