import React from 'react';
import ReactDOM from 'react-dom';

import { StoreProvider } from './store/reducer';

import './global.scss';
import Home from './layouts/Home';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <Home />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
