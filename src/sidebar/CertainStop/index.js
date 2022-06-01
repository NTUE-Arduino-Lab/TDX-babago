import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Search from '../../components/Search';
import CertainStopBox from '../../components/CertainStopBox';

function CertainStop() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <Search></Search>
        <CertainStopBox></CertainStopBox>
      </div>
    </Fragment>
  );
}

export default CertainStop;
