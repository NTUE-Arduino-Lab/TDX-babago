import React from 'react';
import styles from './styles.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Search() {
  return (
    <div className={styles.searchBar}>
      <FontAwesomeIcon className={styles.searchBar_icon} icon={faSearch} />
      <div
        className={`${styles.searchBar_inputBox} ${styles.box__alignItemsCenter}`}
      >
        <input
          className={styles.inputBox_text}
          type="text"
          placeholder="搜尋車站或站牌名稱"
        />
      </div>
    </div>
  );
}

export default Search;
