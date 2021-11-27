import React from 'react';
import styles from './styles.module.scss';

function Nav() {
  return (
    <div className={`${styles.nav} ${styles.box__spaceBetween}`}>
      <div className={styles.nav_logo}></div>
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
