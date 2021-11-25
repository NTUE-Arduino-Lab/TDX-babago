import axios from 'axios';
import type from './actionTypes';

const LOCATION_URL = 'https://api.nlsc.gov.tw/other/TownVillagePointQuery';

export const setPosition = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { position } = options;

  try {
    dispatch({
      type: type.SET_POSITION,
      payload: position,
    });
    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } catch (error) {
    dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
  }
};

export const setLocation = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { lng, lat } = options;

  try {
    const url = `${LOCATION_URL}/${lng}/${lat}`;
    const response = await axios.get(url);
    const xmlData = response.data;
    const data = new window.DOMParser().parseFromString(xmlData, 'text/xml');
    const location = {
      city: data.getElementsByTagName('ctyName')[0].innerHTML,
      town: data.getElementsByTagName('townName')[0].innerHTML,
    };

    // console.log(location);

    dispatch({
      type: type.SET_LOCATION,
      payload: location,
    });
    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } catch (error) {
    dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
  }
};
