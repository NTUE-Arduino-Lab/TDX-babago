import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import WeatherBox from '../../components/WeatherBox';
import ClosestBox from '../../components/ClosestBox';

function Closest() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <WeatherBox></WeatherBox>
        <ClosestBox></ClosestBox>
      </div>
    </Fragment>
  );
}

export default Closest;
