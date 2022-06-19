import axios from 'axios';
import type from './actionTypes';

//Firebase
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const FIREBASE_URL =
  'https://fcm.googleapis.com/v1/projects/babago-noti/messages:send';
const KEY_API = 'https://babago-api.herokuapp.com/';
// const token =
//   'egjfDhSeMA4xv-RtsPaNZO:APA91bFj-DfT8kUurHr34cpLVUpdZsbbR3R3MSJ5YDt1LvqLlEqF0mmTIJ8fv24X760Y0Rwx9-6qOgXUHWT1ACSByBb6C2jIHCW_DhDp4XEOIXY6174BRV1Yokek6L7LN9Ro7rw_wz-Q';

//Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCuNSt10JtORrzP3Pq_D0nzs4BUouHm0NI',
  authDomain: 'babago-noti.firebaseapp.com',
  projectId: 'babago-noti',
  storageBucket: 'babago-noti.appspot.com',
  messagingSenderId: '127721117499',
  appId: '1:127721117499:web:48b56d8aea4e31f1d5c91e',
};

initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const publicKey =
  'BJhB-CwmACWUjwyfpVFXeTKMQ5O2GeBAcy7u3Js7SA3Lw4XmipfUiStp1DcbsuhzEzuYCdJBVvGTXmDDWpcAq1c';

export const fetchToken = (dispatch) => {
  // const messaging = getMessaging();
  return getToken(messaging, {
    vapidKey: publicKey,
  })
    .then((currentToken) => {
      if (currentToken) {
        // console.log('current token for client: ', currentToken);
        // setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
        dispatch({
          type: type.SET_TOKEN,
          payload: currentToken,
        });
        console.log(currentToken);
      } else {
        console.log(
          'No registration token available. Request permission to generate one.',
        );
        // setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export const remindNotification = async (remindBus, token) => {
  try {
    console.log(remindBus);
    let bus = remindBus;
    let stopStatus = '';
    if (bus.stopStatus !== '進站中') {
      stopStatus = '即將在' + bus.stopStatus + '內抵達';
    } else {
      stopStatus = '即將抵達';
    }
    const key = await axios.get(KEY_API);
    const { data } = await axios.post(
      FIREBASE_URL,
      {
        message: {
          data: {
            title: '公車即將抵達',
            body: bus.routeName + stopStatus + bus.stationName,
          },
          token: token,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // prettier-ignore
          'Authorization': `Bearer ${key.data}`,
        },
      },
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export const onReserveNotification = async (busdata, token) => {
  try {
    const { bus } = busdata;
    let stopStatus = '';
    if (bus.stopStatus !== '進站中') {
      stopStatus = '即將在' + bus.stopStatus + '內抵達';
    } else {
      stopStatus = '即將抵達';
    }
    const key = await axios.get(KEY_API);
    const { data } = await axios.post(
      FIREBASE_URL,
      {
        message: {
          data: {
            title: '您預約的公車即將抵達',
            body: bus.routeName + stopStatus + bus.stationName,
          },
          token: token,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // prettier-ignore
          'Authorization': `Bearer ${key.data}`,
        },
      },
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
