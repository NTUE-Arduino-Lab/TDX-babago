import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import ScanBox from '../../components/ScanBox';
import ReserveBox from '../../components/ReserveBox';
import RemindBox from '../../components/RemindBox';
import HomeClosestStopBox from '../../components/HomeClosestStopBox';
import HomeNearbyStopsBox from '../../components/HomeNearbyStopsBox';

function Home() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <ScanBox></ScanBox>
        <ReserveBox></ReserveBox>
        <RemindBox></RemindBox>
        <HomeClosestStopBox></HomeClosestStopBox>
        <HomeNearbyStopsBox></HomeNearbyStopsBox>
      </div>
    </Fragment>
  );
}

export default Home;
