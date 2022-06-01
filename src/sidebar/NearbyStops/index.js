import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import NearbyStopsBox from '../../components/NearbyStopsBox';

function NearbyStops() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <NearbyStopsBox></NearbyStopsBox>
      </div>
    </Fragment>
  );
}

export default NearbyStops;
