import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import CertainRouteBox from '../../components/CertainRouteBox';

function CertainRoute() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <CertainRouteBox></CertainRouteBox>
      </div>
    </Fragment>
  );
}

export default CertainRoute;
