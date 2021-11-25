import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [location, setLocation] = useState([]);

  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  useEffect(() => {
    if (position) {
      fetch(
        `https://api.nlsc.gov.tw/other/TownVillagePointQuery/${position.lng}/${position.lat}`,
      )
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then((data) =>
          setLocation([
            data.getElementsByTagName('ctyName')[0].innerHTML,
            data.getElementsByTagName('townName')[0].innerHTML,
          ]),
        );
    }
  }, [position]);

  return location.length === 0 ? (
    0
  ) : (
    <Marker position={position}>
      <Popup>
        <b>city</b>: {location[0]} <br />
        <b>town</b>: {location[1]}
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
