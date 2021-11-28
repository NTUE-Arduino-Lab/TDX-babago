import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import WeatherBox from '../../components/WeatherBox';
import CertainStopBox from '../../components/CertainStopBox';

function CertainStop() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <WeatherBox></WeatherBox>
        <CertainStopBox></CertainStopBox>
      </div>
    </Fragment>
  );
}

export default CertainStop;
