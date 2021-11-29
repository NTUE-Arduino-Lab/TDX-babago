import axios from 'axios';
import jsSHA from 'jssha';
import { getDistance } from 'geolib';

import type from './actionTypes';

import cityJson from '../asset/json/city.json';

const LOCATION_URL = 'https://api.nlsc.gov.tw/other/TownVillagePointQuery';
const WEATHER_URL = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore';
const TDXBUS_URL = 'https://ptx.transportdata.tw/MOTC/v2/Bus';

function GetAuthorizationHeader() {
  var AppID = '88836dc3bd984400b7b3ea51e35e2627';
  var AppKey = 'AqupXvSAdKge3ptnkghRmreRdrc';

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';

  return {
    Authorization: Authorization,
    'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/,
  }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}

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
  dispatch({ type: type.BEGIN_DATA_REQUEST });
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

        if (T.time.length > 8) {
          for (var j = 0; j < 8; j++) {
            tempArray.push(T.time[j].elementValue[0].value);
          }
        } else {
          T.time.map((timeData) =>
            tempArray.push(timeData.elementValue[0].value),
          );
        }

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

        // console.log(weather);

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

export const setNearbyStops = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { lng, lat } = options;

  try {
    const url = `${TDXBUS_URL}/Station/NearBy?$spatialFilter=nearby(${lat},${lng},500)&$format=JSON'/${lng}/${lat}`;
    let config = {
      headers: GetAuthorizationHeader(),
    };
    const response = await axios.get(url, config);
    const data = response.data;

    const nearbyStops = [];

    data.map((station) => {
      const stationID = station.StationID;
      const stationName = station.StationName.Zh_tw;
      const stationLon = station.StationPosition.PositionLon;
      const stationLat = station.StationPosition.PositionLat;

      const stationDistance = getDistance(
        { latitude: lat, longitude: lng },
        { latitude: stationLat, longitude: stationLon },
      );

      const routes = [];
      station.Stops.map((stops) => routes.push(stops.RouteName.Zh_tw));

      nearbyStops.push({
        stationID: stationID,
        stationName: stationName,
        stationLon: stationLon,
        stationLat: stationLat,
        stationDistance: stationDistance,
        routes: routes,
      });
    });

    nearbyStops.sort(function (a, b) {
      if (a.stationDistance > b.stationDistance) {
        return 1;
      }
      if (a.stationDistance < b.stationDistance) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    // console.log(nearbyStops);

    dispatch({
      type: type.SET_NEARBYSTOPS,
      payload: nearbyStops,
    });
    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } catch (error) {
    dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
  }
};

export const setCertainRoutes = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { stationID, city } = options;

  for (var i = 0; i < cityJson.length; i++) {
    if (cityJson[i].city === city) {
      const cityEn = cityJson[i].cityEn;

      // console.log(stationID);
      // console.log(cityEn);

      try {
        const url = `${TDXBUS_URL}/EstimatedTimeOfArrival/City/${cityEn}/PassThrough/Station/${stationID}`;
        let config = {
          headers: GetAuthorizationHeader(),
        };
        const response = await axios.get(url, config);
        const data = response.data;

        const certainRoutes = [];

        data.map((stop) => {
          const routeID = stop.RouteID;
          const routeName = stop.RouteName.Zh_tw;
          const stopStatusArray = [
            `${Math.round(stop.EstimateTime / 60)} 分`,
            '尚未發車',
            '交管不停靠',
            '末班車已過',
            '今日未營運',
            '進站中',
          ];

          var stopStatus = null;
          if (Math.round(stop.EstimateTime / 60) <= 1) {
            stopStatus = stopStatusArray[5];
          } else if (stop.StopStatus >= 0) {
            stopStatus = stopStatusArray[stop.StopStatus];
          } else {
            stopStatus = null;
          }

          certainRoutes.push({
            routeID: routeID,
            routeName: routeName,
            stopStatus: stopStatus,
          });
        });

        // console.log(certainRoutes);

        dispatch({
          type: type.SET_CERTAINROUTES,
          payload: certainRoutes,
        });
        dispatch({ type: type.SUCCESS_DATA_REQUEST });
      } catch (error) {
        dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
      }
    }
  }
};

export const setSelectStopIndex = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { index } = options;

  try {
    dispatch({
      type: type.SET_SELECTSTOPINDEX,
      payload: index,
    });

    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } catch (error) {
    dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
  }
};
