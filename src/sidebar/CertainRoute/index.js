import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import CertainRouteBox from '../../components/CertainRouteBox';

function CertainRoute() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <CertainRouteBox></CertainRouteBox>
      </div>
    </Fragment>
  );
}

export default CertainRoute;
