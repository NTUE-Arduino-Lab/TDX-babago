import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import { setSelectStopIndex } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

function Nav() {
  const { dispatch } = useContext(StoreContext);

  return (
    <div className={`${styles.nav} ${styles.box__spaceBetween}`}>
      <Link
        to={path.home}
        onClick={() => setSelectStopIndex(dispatch, { index: 0 })}
      >
        <div className={styles.nav_logo}></div>
      </Link>
      <div className={styles.nav_buttonBox}>
        <Link
          to={path.home}
          className={styles.buttonBox_button}
          onClick={() => setSelectStopIndex(dispatch, { index: 0 })}
        >
          <div className={styles.button_icon}></div>
        </Link>
        <Link
          to={path.nearbyStops}
          className={styles.buttonBox_button}
          onClick={() => setSelectStopIndex(dispatch, { index: 0 })}
        >
          <div className={styles.button_icon}></div>
        </Link>
      </div>
    </div>
  );
}

export default Nav;
