import React, { useEffect, useContext, useState, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as QueryString from 'query-string';

import path from '../../router/path';
import styles from './styles.module.scss';

import currentMarker from '../../asset/imgs/currentMarker.svg';
import stopMarker from '../../asset/imgs/stopMarker.svg';
import selectStopMarker from '../../asset/imgs/selectStopMarker.svg';

import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import { setPosition, setLocation, setNearbyStops } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

function LocationMarker() {
  const reactlocation = useLocation();
  const { lng, lat, stationID } = QueryString.parse(reactlocation.search);
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const {
    state: { position, location, nearbyStops },
    dispatch,
  } = useContext(StoreContext);

  const redIcon = new L.Icon({
    iconUrl: currentMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: styles.currentIcon,
  });

  // const largeBlueIcon = new L.Icon({
  //   iconUrl: stopMarker,
  //   iconSize: [37, 61],
  //   iconAnchor: [19, 61],
  //   popupAnchor: [1, -34],
  //   shadowSize: [61, 61],
  //   className: styles.selectIcon,
  // });

  const blueIcon = new L.Icon({
    iconUrl: stopMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const selectIcon = new L.Icon({
    iconUrl: selectStopMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: styles.selectIcon,
  });

  const initMap = useMap();

  useEffect(() => {
    if ((lng, lat)) {
      setPosition(dispatch, { position: { lng, lat } });
      initMap.flyTo({ lng, lat }, initMap.getZoom());
    } else {
      initMap.locate().on('locationfound', function (e) {
        console.log(e.latlng);
        setPosition(dispatch, { position: e.latlng });
        initMap.flyTo(e.latlng, initMap.getZoom());
        navigate(`${path.home}?lng=${e.latlng.lng}&lat=${e.latlng.lat}`);
      });
    }
  }, [initMap]);

  const clickMap = useMapEvents({
    click(e) {
      setPosition(dispatch, { position: e.latlng });
      clickMap.flyTo(e.latlng, clickMap.getZoom());
      navigate(`${path.nearbyStops}?lng=${e.latlng.lng}&lat=${e.latlng.lat}`);
    },
  });

  useEffect(() => {
    if (position) {
      setLocation(dispatch, { lng: position.lng, lat: position.lat });
      setNearbyStops(dispatch, { lng: position.lng, lat: position.lat });
      setMarkers([]);
    }
  }, [position]);

  useEffect(() => {
    if (nearbyStops) {
      var stopsArray = [];
      nearbyStops.map((nearbyStopsName) => {
        nearbyStopsName.stationIDs.map((nearbyStop) => {
          stopsArray.push({
            position: nearbyStop.position,
            stationName: nearbyStop.stationName,
            stationID: nearbyStop.stationID,
            stationDistance: nearbyStop.stationDistance,
          });
        });
      });
      setMarkers(stopsArray);
    }
  }, [nearbyStops]);

  useEffect(() => {
    // if (markers) {
    //   console.log(markers);
    // }
  }, [markers]);

  return location === null ? null : (
    <Fragment>
      <Marker position={position} icon={redIcon}>
        <Tooltip
          className={styles.tooltip}
          direction="top"
          opacity={1}
          offset={[0, -41]}
        >
          <div className={styles.tooltip_rowBox}>
            <div
              className={`${styles.rowBox_titleText} ${styles.rowBox__marginRight}`}
            >
              {location.city}
            </div>
            <div className={styles.rowBox_titleText}>{location.town}</div>
          </div>
        </Tooltip>
      </Marker>
      {markers.map((marker) => (
        <Marker
          key={marker.stationID}
          position={marker.position}
          icon={stationID == marker.stationID ? selectIcon : blueIcon}
          eventHandlers={{
            click: () => {
              if (stationID != marker.stationID) {
                navigate(
                  `${path.certainStop}?lng=${position.lng}&lat=${position.lat}&stationName=${marker.stationName}&stationID=${marker.stationID}&stationDistance=${marker.stationDistance}`,
                );
              }
            },
          }}
        >
          <Tooltip
            className={styles.tooltip}
            direction="top"
            opacity={1}
            offset={[0, -40]}
          >
            <div className={styles.tooltip_rowBox}>
              <div
                className={`${styles.rowBox_titleText} ${styles.rowBox__marginRight}`}
              >
                {marker.stationName}
              </div>
              <div className={styles.rowBox_stopDistance}>
                {marker.stationDistance} 公尺
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </Fragment>
  );
}

function Map() {
  return (
    <Fragment>
      <MapContainer
        center={[25.022729, 121.545103]}
        zoom={17}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </Fragment>
  );
}

export default Map;
