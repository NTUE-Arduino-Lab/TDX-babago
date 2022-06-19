import React from 'react';
import ReactDOM from 'react-dom';

import './global.scss';
import Router from './router';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import path from './router/path';

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

//firebase service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`${path.home}/firebase-messaging-sw.js`)
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function (err) {
      console.log('Service worker registration failed, error:', err);
    });
}
