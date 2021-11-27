import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Nav from '../../components/Nav';
import Search from '../../components/Search';
import WeatherBox from '../../components/WeatherBox';
import NearbyBox from '../../components/NearbyBox';
import Map from '../../components/Map';

function NearbyStop() {
  return (
    <Fragment>
      <div className={styles.container}>
        <Nav></Nav>
        <div className={styles.sidebar}>
          <Search></Search>
          <WeatherBox></WeatherBox>
          <NearbyBox></NearbyBox>
        </div>
        <Map></Map>
      </div>
    </Fragment>
  );
}

export default NearbyStop;
