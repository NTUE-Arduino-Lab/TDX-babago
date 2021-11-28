import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { StoreProvider } from '../store/reducer';
import styles from './styles.module.scss';

import path from './path';

import Nav from '../components/Nav';
import Map from '../components/Map';

import HomePage from '../sidebar/Home';
import NearbyPage from '../sidebar/Nearby';
import ClosestPage from '../sidebar/Closest';

const Router = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className={styles.container}>
          <Nav></Nav>
          <Routes>
            <Route exact path={path.home} element={<HomePage />} />
            <Route exact path={path.closest} element={<ClosestPage />} />
            <Route exact path={path.nearby} element={<NearbyPage />} />
          </Routes>
          <Map></Map>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default Router;
