import React, { useEffect, useContext, useState, Fragment } from 'react';
import styles from './styles.module.scss';

import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import { setPosition, setLocation } from '../../store/actions';
import { StoreContext } from '../../store/reducer';

function LocationMarker() {
  const [markers, setMarkers] = useState([]);
  const {
    state: { position, location, nearbyStops },
    dispatch,
  } = useContext(StoreContext);

  const redIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const initMap = useMap();

  useEffect(() => {
    initMap.locate().on('locationfound', function (e) {
      // console.log(e.latlng);
      // console.log(e.bounds._northEast);
      setPosition(dispatch, { position: e.latlng });
      // setPosition(dispatch, { position: e.bounds._northEast });
      initMap.flyTo(e.latlng, initMap.getZoom());
    });
  }, [initMap]);

  const clickMap = useMapEvents({
    click(e) {
      setPosition(dispatch, { position: e.latlng });
      clickMap.flyTo(e.latlng, clickMap.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      setLocation(dispatch, { lng: position.lng, lat: position.lat });
      setMarkers([]);
    }
  }, [position]);

  useEffect(() => {
    if (nearbyStops) {
      nearbyStops.map((nearbyStop) => {
        setMarkers((prevValue) => [
          ...prevValue,
          {
            position: {
              lat: nearbyStop.stationLat,
              lng: nearbyStop.stationLon,
            },
            stationName: nearbyStop.stationName,
          },
        ]);
      });
    }
  }, [nearbyStops]);

  return location === null ? null : (
    <Fragment>
      <Marker position={position} icon={redIcon}>
        <Popup>
          <b>縣市</b>: {location.city} <br />
          <b>鄉鎮</b>: {location.town}
        </Popup>
      </Marker>
      {markers.map((marker, index) => (
        <Marker position={marker.position} key={index}>
          <Popup>
            <b>站牌名稱</b>: {marker.stationName} <br />
            {/* <b>lat</b>: {marker.lat} */}
          </Popup>
        </Marker>
      ))}
    </Fragment>
  );
}

function Map() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={16}
      scrollWheelZoom={true}
      className={styles.map}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}

export default Map;
