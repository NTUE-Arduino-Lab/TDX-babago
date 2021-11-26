import axios from 'axios';
import type from './actionTypes';

import cityJson from '../asset/json/city.json';

const LOCATION_URL = 'https://api.nlsc.gov.tw/other/TownVillagePointQuery';
const WEATHER_URL = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore';

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
    const data = response.data;
    const location = {
      city: data.ctyName,
      town: data.townName,
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

export const setWeather = async (dispatch, options) => {
  dispatch({ type: type.SET_WEATHER });
  const { city, town, timeFrom, timeTo } = options;

  for (var i = 0; i < cityJson.length; i++) {
    if (cityJson[i].city === city) {
      const cityID = cityJson[i].cityID;

      try {
        const url = `${WEATHER_URL}/${cityID}?Authorization=CWB-CF0FED1F-8E9E-4451-9F24-5C3A0D03A267&locationName=${town}&elementName=Wx,PoP12h,T&timeFrom=${timeFrom}&timeTo=${timeTo}`;
        const response = await axios.get(url);
        const data = response.data;

        const PoP12h = data.records.locations[0].location[0].weatherElement[0];
        const Wx = data.records.locations[0].location[0].weatherElement[1];
        const T = data.records.locations[0].location[0].weatherElement[2];

        const rainRate = PoP12h.time[0].elementValue[0].value;
        const weatherState = Wx.time[0].elementValue[0].value;
        const tempArray = [];
        T.time.map((timeData) =>
          tempArray.push(timeData.elementValue[0].value),
        );

        const currentTemp = tempArray[0];
        const minTemp = tempArray.sort()[0];
        const maxTemp = tempArray.sort()[tempArray.length - 1];

        const weather = {
          rainRate: rainRate,
          weatherState: weatherState,
          currentTemp: currentTemp,
          minTemp: minTemp,
          maxTemp: maxTemp,
        };

        console.log(weather);

        dispatch({
          type: type.SET_WEATHER,
          payload: weather,
        });
        dispatch({ type: type.SUCCESS_DATA_REQUEST });
      } catch (error) {
        dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
      }
    }
  }
};
