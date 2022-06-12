import axios from 'axios';
import jsSHA from 'jssha';
import { getDistance } from 'geolib';

import type from './actionTypes';

import cityJson from '../asset/json/city.json';

const LOCATION_URL = 'https://api.nlsc.gov.tw/other/TownVillagePointQuery';
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

export const setNearbyStops = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { lng, lat } = options;

  try {
    const url = `${TDXBUS_URL}/Station/NearBy?$spatialFilter=nearby(${lat},${lng},220)&$format=JSON'/${lng}/${lat}`;
    let config = {
      headers: GetAuthorizationHeader(),
    };
    const response = await axios.get(url, config);
    const data = response.data;

    const nearbyStops = [];

    data.map((station) => {
      const stationUID = station.StationUID;
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
        stationUID: stationUID,
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

    let i = 0;
    let j = 0;
    let nameFlag = true;
    let IDFlag = true;
    let nearbyStopsName = [];
    let nearbyStopsID = [];

    for (i = 0; i < nearbyStops.length; i++) {
      IDFlag = true;
      for (j = 0; j < nearbyStopsID.length; j++) {
        if (nearbyStops[i].stationID == nearbyStopsID[j].stationID) {
          IDFlag = false;
          j = nearbyStopsID.length;
        }
      }
      if (IDFlag) {
        nearbyStopsID.push({
          stationName: nearbyStops[i].stationName,
          stationID: nearbyStops[i].stationID,
          stationDistance: nearbyStops[i].stationDistance,
          position: {
            lat: nearbyStops[i].stationLat,
            lng: nearbyStops[i].stationLon,
          },
          stationStops: [],
        });
      }
    }

    for (i = 0; i < nearbyStops.length; i++) {
      for (j = 0; j < nearbyStopsID.length; j++) {
        if (nearbyStops[i].stationID == nearbyStopsID[j].stationID) {
          nearbyStopsID[j].stationStops.push(nearbyStops[i]);
        }
      }
    }

    for (i = 0; i < nearbyStopsID.length; i++) {
      nameFlag = true;
      for (j = 0; j < nearbyStopsName.length; j++) {
        if (nearbyStopsID[i].stationName == nearbyStopsName[j].stationName) {
          nameFlag = false;
          j = nearbyStopsName.length;
        }
      }
      if (nameFlag) {
        nearbyStopsName.push({
          stationName: nearbyStopsID[i].stationName,
          stationIDs: [],
        });
      }
    }

    for (i = 0; i < nearbyStopsID.length; i++) {
      for (j = 0; j < nearbyStopsName.length; j++) {
        if (nearbyStopsID[i].stationName == nearbyStopsName[j].stationName) {
          nearbyStopsName[j].stationIDs.push(nearbyStopsID[i]);
        }
      }
    }

    dispatch({
      type: type.SET_NEARBYSTOPS,
      payload: nearbyStopsName,
    });
    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } catch (error) {
    dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
  }
};

export const setCurrentBuses = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { stationID, city } = options;

  if (!stationID || !city) {
    dispatch({
      type: type.SET_CURRENTBUSES,
      payload: null,
    });

    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } else {
    for (var i = 0; i < cityJson.length; i++) {
      if (cityJson[i].city === city) {
        const cityEn = cityJson[i].cityEn;

        try {
          const url = `${TDXBUS_URL}/EstimatedTimeOfArrival/City/${cityEn}/PassThrough/Station/${stationID}`;
          let config = {
            headers: GetAuthorizationHeader(),
          };
          const response = await axios.get(url, config);
          const data = response.data;

          // console.log(data);
          const currentBuses = [];

          data.map((bus) => {
            const direction = bus.Direction;
            const routeUID = bus.RouteUID;
            const routeName = bus.RouteName.Zh_tw;
            const stopStatusArray = [
              `${Math.round(bus.EstimateTime / 60)} 分`,
              '尚未發車',
              '交管不停靠',
              '末班車已過',
              '今日未營運',
              '進站中',
            ];

            var stopStatus = null;
            if (Math.round(bus.EstimateTime / 60) <= 1) {
              stopStatus = stopStatusArray[5];
            } else if (bus.StopStatus >= 0) {
              stopStatus = stopStatusArray[bus.StopStatus];
            } else {
              stopStatus = null;
            }

            currentBuses.push({
              direction: direction,
              routeUID: routeUID,
              routeName: routeName,
              stopStatus: stopStatus,
            });
          });

          // console.log(currentBuses);

          dispatch({
            type: type.SET_CURRENTBUSES,
            payload: currentBuses,
          });
          dispatch({ type: type.SUCCESS_DATA_REQUEST });
        } catch (error) {
          dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
        }
      }
    }
  }
};

export const setCertainRoutes = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { city, currentBuses } = options;

  for (var i = 0; i < cityJson.length; i++) {
    if (cityJson[i].city === city) {
      const cityEn = cityJson[i].cityEn;

      try {
        const certainRoutes = [];
        for (var j = 0; j < currentBuses.length; j++) {
          const url = `${TDXBUS_URL}/Route/City/${cityEn}/${currentBuses[j].routeName}`;

          let config = {
            headers: GetAuthorizationHeader(),
          };
          const response = await axios.get(url, config);
          const data = response.data;

          for (var k = 0; k < data.length; k++) {
            if (data[k].RouteUID == currentBuses[j].routeUID) {
              certainRoutes.push({
                routeName: currentBuses[j].routeName,
                departureStopNameZh: data[k].DepartureStopNameZh,
                destinationStopNameZh: data[k].DestinationStopNameZh,
                fareBufferZoneDescriptionZh:
                  data[k].FareBufferZoneDescriptionZh,
                city: data[k].City,
              });
            }
          }
        }

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

export const setSelectRouteStopsSort = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { city, selectRoute } = options;

  if (!city || !selectRoute) {
    dispatch({
      type: type.SET_SELECTROUTESTOPSSORT,
      payload: null,
    });

    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } else {
    for (var i = 0; i < cityJson.length; i++) {
      if (cityJson[i].city === city) {
        const cityEn = cityJson[i].cityEn;

        try {
          const selectRouteStopsSort = [];
          const url = `${TDXBUS_URL}/DisplayStopOfRoute/City/${cityEn}/${selectRoute.routeName}`;

          let config = {
            headers: GetAuthorizationHeader(),
          };
          const response = await axios.get(url, config);
          const data = response.data;
          // console.log(data);

          for (var j = 0; j < data.length; j++) {
            if (selectRoute.routeUID == data[j].RouteUID) {
              selectRouteStopsSort.push({
                direction: data[j].Direction,
                routeUID: data[j].RouteUID,
                routeName: selectRoute.routeName,
                stops: data[j].Stops,
              });
            }
          }

          // console.log(selectRouteStops);

          dispatch({
            type: type.SET_SELECTROUTESTOPSSORT,
            payload: selectRouteStopsSort,
          });

          dispatch({ type: type.SUCCESS_DATA_REQUEST });
        } catch (error) {
          dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
        }
      }
    }
  }
};

export const setSelectRouteStopsTime = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { city, selectRoute } = options;

  if (!city || !selectRoute) {
    dispatch({
      type: type.SET_SELECTROUTESTOPSTIME,
      payload: null,
    });

    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } else {
    for (var i = 0; i < cityJson.length; i++) {
      if (cityJson[i].city === city) {
        const cityEn = cityJson[i].cityEn;

        try {
          const selectRouteStopsTime = [];
          const url = `${TDXBUS_URL}/EstimatedTimeOfArrival/City/${cityEn}/${selectRoute.routeName}`;

          let config = {
            headers: GetAuthorizationHeader(),
          };
          const response = await axios.get(url, config);
          const data = response.data;
          // console.log(data);

          for (var j = 0; j < data.length; j++) {
            if (selectRoute.routeUID == data[j].RouteUID) {
              selectRouteStopsTime.push({
                direction: data[j].Direction,
                routeUID: data[j].RouteUID,
                stopUID: data[j].StopUID,
                stopStatus: data[j].StopStatus,
                plateNumb: data[j].PlateNumb,
                estimateTime: data[j].EstimateTime,
              });
            }
          }

          dispatch({
            type: type.SET_SELECTROUTESTOPSTIME,
            payload: selectRouteStopsTime,
          });

          dispatch({ type: type.SUCCESS_DATA_REQUEST });
        } catch (error) {
          dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
        }
      }
    }
  }
};

export const setSelectRouteBuses = async (dispatch, options) => {
  dispatch({ type: type.BEGIN_DATA_REQUEST });
  const { city, selectRoute } = options;

  if (!city || !selectRoute) {
    dispatch({
      type: type.SET_SELECTROUTEBUSES,
      payload: null,
    });

    dispatch({ type: type.SUCCESS_DATA_REQUEST });
  } else {
    for (var i = 0; i < cityJson.length; i++) {
      if (cityJson[i].city === city) {
        const cityEn = cityJson[i].cityEn;

        try {
          const selectRouteBuses = [];
          const url = `${TDXBUS_URL}/RealTimeNearStop/City/${cityEn}/${selectRoute.routeName}`;

          let config = {
            headers: GetAuthorizationHeader(),
          };
          const response = await axios.get(url, config);
          const data = response.data;
          // console.log(data);

          for (var j = 0; j < data.length; j++) {
            if (selectRoute.routeUID == data[j].RouteUID) {
              selectRouteBuses.push({
                routeUID: data[j].RouteUID,
                direction: data[j].Direction,
                plateNumb: data[j].PlateNumb,
                a2EventType: data[j].A2EventType,
                stopUID: data[j].StopUID,
                stopSequence: data[j].StopSequence,
                dutyStatus: data[j].DutyStatus,
                busStatus: data[j].BusStatus,
              });
            }
          }

          // console.log(selectRouteBuses);

          dispatch({
            type: type.SET_SELECTROUTEBUSES,
            payload: selectRouteBuses,
          });

          dispatch({ type: type.SUCCESS_DATA_REQUEST });
        } catch (error) {
          dispatch({ type: type.FAIL_DATA_REQUEST, payload: error });
        }
      }
    }
  }
};
