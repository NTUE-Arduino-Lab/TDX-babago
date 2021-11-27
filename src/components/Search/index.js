import React from 'react';
import styles from './styles.module.scss';

function Search() {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchBar_icon}></div>
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
