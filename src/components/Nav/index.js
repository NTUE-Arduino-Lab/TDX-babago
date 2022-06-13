import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Nav() {
  const reactlocation = useLocation();
  const { lng, lat } = QueryString.parse(reactlocation.search);

  return (
    <div className={`${styles.nav} ${styles.box__spaceBetween}`}>
      <Link to={`${path.home}?lng=${lng}&lat=${lat}`}>
        <div className={styles.nav_logo}></div>
      </Link>
      <Link
        to={`${path.home}?lng=${lng}&lat=${lat}`}
        className={styles.nav_search}
      >
        <FontAwesomeIcon className={styles.button_icon} icon={faSearch} />
      </Link>
    </div>
  );
}

export default Nav;
