import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import ScanBox from '../../components/ScanBox';
import RemindBox from '../../components/RemindBox';
import ReserveOffBox from '../../components/ReserveOffBox';
import ReserveBox from '../../components/ReserveBox';
import HomeClosestStopBox from '../../components/HomeClosestStopBox';
import HomeNearbyStopsBox from '../../components/HomeNearbyStopsBox';

function Home() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <ScanBox></ScanBox>
        <RemindBox></RemindBox>
        <ReserveOffBox></ReserveOffBox>
        <ReserveBox></ReserveBox>
        <HomeClosestStopBox></HomeClosestStopBox>
        <HomeNearbyStopsBox></HomeNearbyStopsBox>
      </div>
    </Fragment>
  );
}

export default Home;
