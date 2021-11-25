import React, { Fragment } from 'react';
import styles from './styles.module.scss';

import Nav from '../../components/Nav';
import Sidebar from '../../components/Sidebar';
import Map from '../../components/Map';

function Home() {
  return (
    <Fragment>
      <div className={styles.container}>
        <Nav></Nav>
        <Sidebar></Sidebar>
        <Map></Map>
      </div>
    </Fragment>
  );
}

export default Home;
