import React, { useEffect, useContext } from 'react';
import styles from './styles.module.scss';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import { setPosition, setLocation } from '../../store/actions';
import { StoreContext } from '../../store/reducer';
function LocationMarker() {
  const {
    state: { position },
    dispatch,
  } = useContext(StoreContext);

  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      // console.log(e.latlng);
      setPosition(dispatch, { position: e.latlng });
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  useEffect(() => {
    if (position) {
      setLocation(dispatch, { lng: position.lng, lat: position.lat });
    }
  }, [position]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <b>lng</b>: {position.lng} <br />
        <b>lat</b>: {position.lat}
      </Popup>
    </Marker>
  );
}

function Map() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
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
