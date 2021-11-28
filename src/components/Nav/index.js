import React from 'react';
import { Link } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

function Nav() {
  return (
    <div className={`${styles.nav} ${styles.box__spaceBetween}`}>
      <Link to={path.home}>
        <div className={styles.nav_logo}></div>
      </Link>
      <div className={styles.nav_buttonBox}>
        <div className={styles.buttonBox_button}>
          <div className={styles.button_icon}></div>
        </div>
        <div className={styles.buttonBox_button}>
          <div className={styles.button_icon}></div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
