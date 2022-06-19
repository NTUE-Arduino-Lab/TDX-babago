import { React, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { StoreProvider } from '../store/reducer';
import styles from './styles.module.scss';

import path from './path';

import Nav from '../components/Nav';
import Map from '../components/Map';
import Notification from '../components/Notification';

import HomePage from '../sidebar/Home';
import NearbyStopsPage from '../sidebar/NearbyStops';
import CertainStopPage from '../sidebar/CertainStop';
import CertainRoutePage from '../sidebar/CertainRoute';
import ScanQrcodePage from '../sidebar/ScanQrcode';

import { onMessageListener } from '../store/firebase';

const Router = () => {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });

  const close = () => {
    setShow(false);
  };

  onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.data.title,
        body: payload.data.body,
      });
      console.log(payload);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <StoreProvider>
      <BrowserRouter>
        {show ? (
          <Notification
            show={show}
            close={close}
            title={notification.title}
            body={notification.body}
          />
        ) : (
          <></>
        )}
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
