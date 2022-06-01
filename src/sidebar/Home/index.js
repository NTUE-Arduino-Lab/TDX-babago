import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import HomeClosestStopBox from '../../components/HomeClosestStopBox';
import HomeNearbyStopsBox from '../../components/HomeNearbyStopsBox';

function Home() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <HomeClosestStopBox></HomeClosestStopBox>
        <HomeNearbyStopsBox></HomeNearbyStopsBox>
      </div>
    </Fragment>
  );
}

export default Home;
