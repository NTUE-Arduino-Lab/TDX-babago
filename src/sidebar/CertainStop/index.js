import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import CertainStopBox from '../../components/CertainStopBox';

function CertainStop() {
  return (
    <Fragment>
      <div className={styles.sidebar}>
        <CertainStopBox></CertainStopBox>
      </div>
    </Fragment>
  );
}

export default CertainStop;
