import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { StoreProvider } from '../store/reducer';

import path from './path';

import HomePage from '../layouts/Home';

const Router = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* 首頁 */}
          <Route exact path={path.home} element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default Router;
