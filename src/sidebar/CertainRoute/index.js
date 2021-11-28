import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import WeatherBox from '../../components/WeatherBox';
import CertainRouteBox from '../../components/CertainRouteBox';

function CertainRoute() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <WeatherBox></WeatherBox>
        <CertainRouteBox></CertainRouteBox>
      </div>
    </Fragment>
  );
}

export default CertainRoute;
