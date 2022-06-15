import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { StoreProvider } from '../store/reducer';
import styles from './styles.module.scss';

import path from './path';

import Nav from '../components/Nav';
import Map from '../components/Map';

import HomePage from '../sidebar/Home';
import NearbyStopsPage from '../sidebar/NearbyStops';
import CertainStopPage from '../sidebar/CertainStop';
import CertainRoutePage from '../sidebar/CertainRoute';
import ScanQrcodePage from '../sidebar/ScanQrcode';

//firebase
import { fetchToken, onMessageListener } from '../store/firebase';

const Router = () => {
  //firebase
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  fetchToken(setTokenFound);

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log(payload);
    })
    .catch((err) => console.log('failed: ', err));

  useEffect(() => {
    setNotification({
      title: '潘佑萱',
      body: '陳穎融',
    });
  }, [isTokenFound]);

  useEffect(() => {
    console.log(notification);
  }, [notification]);
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className={styles.container}>
          <Nav></Nav>
          <Routes>
            <Route exact path={path.home} element={<HomePage />} />
            <Route
              exact
              path={path.certainStop}
              element={<CertainStopPage />}
            />
            <Route
              exact
              path={path.certainRoute}
              element={<CertainRoutePage />}
            />
            <Route
              exact
              path={path.nearbyStops}
              element={<NearbyStopsPage />}
            />
            <Route exact path={path.scanQrcode} element={<ScanQrcodePage />} />
          </Routes>
          <Map></Map>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default Router;
