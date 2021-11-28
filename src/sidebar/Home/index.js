import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import WeatherBox from '../../components/WeatherBox';
import HomeClosestBox from '../../components/HomeClosestBox';
import HomeNearbyBox from '../../components/HomeNearbyBox';

function Home() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <WeatherBox></WeatherBox>
        <HomeClosestBox></HomeClosestBox>
        <HomeNearbyBox></HomeNearbyBox>
      </div>
    </Fragment>
  );
}

export default Home;
