import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import type from './actionTypes';

export const StoreContext = createContext();

const initialState = {
  position: null,
  location: null,
  nearbyStops: null,
  currentBuses: null,
  certainRoutes: null,
  selectRouteStopsSort: null,
  selectRouteStopsTime: null,
  selectRouteBuses: null,
  remindBuses: [],
  reserveBus: null,
  vehicle: {},
  requestdata: { loading: false, error: null },
};

function reducer(state, action) {
  switch (action.type) {
    case type.SET_POSITION:
      return {
        ...state,
        position: action.payload,
      };
    case type.SET_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    case type.SET_NEARBYSTOPS:
      return {
        ...state,
        nearbyStops: action.payload,
      };
    case type.SET_CURRENTBUSES:
      return {
        ...state,
        currentBuses: action.payload,
      };
    case type.SET_CERTAINROUTES:
      return {
        ...state,
        certainRoutes: action.payload,
      };
    case type.SET_SELECTROUTESTOPSSORT:
      return {
        ...state,
        selectRouteStopsSort: action.payload,
      };
    case type.SET_SELECTROUTESTOPSTIME:
      return {
        ...state,
        selectRouteStopsTime: action.payload,
      };
    case type.SET_SELECTROUTEBUSES:
      return {
        ...state,
        selectRouteBuses: action.payload,
      };
    case type.SET_REMINDBUSES:
      return {
        ...state,
        remindBuses: action.payload,
      };
    case type.SET_RESERVEBUS:
      return {
        ...state,
        reserveBus: action.payload,
      };
    case type.SET_VEHICLE:
      return {
        ...state,
        vehicle: action.payload,
      };
    case type.BEGIN_DATA_REQUEST:
      return {
        ...state,
        requestdata: { ...state.requestdata, loading: true },
      };
    case type.SUCCESS_DATA_REQUEST:
      return {
        ...state,
        requestdata: { ...state.requestdata, loading: false },
      };
    case type.FAIL_DATA_REQUEST:
      return {
        ...state,
        requestdata: {
          ...state.requestdata,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
}

StoreProvider.propTypes = {
  children: PropTypes.object,
};
