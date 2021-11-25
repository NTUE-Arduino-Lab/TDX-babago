import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import nearbyInfoJson from '../../asset/json/nearbyInfo.json';
import closestInfoJson from '../../asset/json/closestInfo.json';

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

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={`${styles.sidebar_nav} ${styles.box__spaceBetween}`}>
          <div className={styles.nav_logo}></div>
          <div className={styles.nav_buttonBox}>
            <div className={styles.buttonBox_button}>
              <div className={styles.button_icon}></div>
            </div>
            <div className={styles.buttonBox_button}>
              <div className={styles.button_icon}></div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar_searchBar}>
          <div className={styles.searchBar_icon}></div>
          <div
            className={`${styles.searchBar_inputBox} ${styles.box__alignItemsCenter}`}
          >
            <input
              className={styles.inputBox_text}
              type="text"
              placeholder="搜尋車站或站牌名稱"
            />
          </div>
        </div>

        <div
          className={`${styles.sidebar_box} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.sidebar_weatherBox__paddingBottom}`}
        >
          <div className={styles.weatherBox_leftInfoBox}>
            <div
              className={`${styles.leftInfoBox__marginBottom} ${styles.box__alignItemsCenter}`}
            >
              <div className={styles.leftInfoBox_locationIcon}></div>
              <div className={styles.leftInfoBox_locationText}>台北市</div>
              <div className={styles.leftInfoBox_locationText}>大安區</div>
            </div>
            <div className={styles.box__alignItemsCenter}>
              <div
                className={`${styles.leftInfoBox__marginRight} ${styles.box__alignItemsCenter}`}
              >
                <div className={styles.leftInfoBox_smallText}>降雨率</div>
                <div className={styles.leftInfoBox_smallText}>90 %</div>
              </div>
              <div className={styles.box__alignItemsCenter}>
                <div className={styles.leftInfoBox_smallText}>23 ˚C</div>
                <div className={styles.leftInfoBox_smallText}>/</div>
                <div className={styles.leftInfoBox_smallText}>14 ˚C</div>
              </div>
            </div>
          </div>
          <div className={styles.box__alignItemsCenter}>
            <div className={styles.rightInfoBox_currentTemp}>20 ˚C</div>
            <div className={styles.rightInfoBox_weatherIcon}></div>
          </div>
        </div>

        <div className={styles.sidebar_box}>
          <div
            className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.closestBox_titlebox__marginBottom}`}
          >
            <div className={styles.linkRow__fontSize}>最近站牌</div>
            <div className={styles.linkRow_arrowIcon}></div>
          </div>
          <div
            className={`${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
          >
            <div className={styles.closestBox_stopName}>
              {closestInfoJson.title}
            </div>
            <div className={styles.closestBox_stopDistance__fontSize}>
              {closestInfoJson.distance}
            </div>
          </div>
          {closestInfoJson.busList.map((busInfo) => (
            <div
              className={`${styles.closestBox_currentInfoBox} ${styles.closestBox_box__marginBottom} ${styles.box__alignItemsCenter}`}
              key={busInfo}
            >
              <div className={styles.currentInfoBox_busName}>
                {busInfo.busName}
              </div>
              <div className={styles.currentInfoBox_busDirection}>
                {busInfo.busDirection}
              </div>
              <div className={styles.currentInfoBox_busState}>
                {busInfo.busState}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sidebar_box}>
          <div
            className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween} ${styles.nearbyBox__marginBottom}`}
          >
            <div className={styles.linkRow__fontSize}>附近站牌</div>
            <div className={styles.linkRow_arrowIcon}></div>
          </div>
          {nearbyInfoJson.map((nearbyInfo, index) => (
            <div className={styles.nearbyBox__marginBottom} key={index}>
              <div
                className={`${styles.busStopBox_stopInfoBox} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
              >
                <div className={styles.stopInfoBox_stopName__fontSize}>
                  {nearbyInfo.title}
                </div>
                <div className={styles.stopInfoBox_stopDistance__fontSize}>
                  {nearbyInfo.distance}
                </div>
              </div>
              <div
                className={`${styles.box_linkRow} ${styles.box__alignItemsCenter} ${styles.box__spaceBetween}`}
              >
                <div className={styles.busStopBox_busNameBox}>
                  {nearbyInfo.busList.map((busName) => (
                    <div key={busName}>
                      <div
                        className={`${styles.busNameBox_busName} ${styles.linkRow__fontSize}`}
                      >
                        {busName}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.linkRow_arrowIcon}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}

export default Home;
