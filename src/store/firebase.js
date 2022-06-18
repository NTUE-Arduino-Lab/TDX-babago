//Firebase
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

//Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCuNSt10JtORrzP3Pq_D0nzs4BUouHm0NI',
  authDomain: 'babago-noti.firebaseapp.com',
  projectId: 'babago-noti',
  storageBucket: 'babago-noti.appspot.com',
  messagingSenderId: '127721117499',
  appId: '1:127721117499:web:48b56d8aea4e31f1d5c91e',
  measurementId: 'G-M4R7NFGZB0',
};

initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const publicKey =
  'BJhB-CwmACWUjwyfpVFXeTKMQ5O2GeBAcy7u3Js7SA3Lw4XmipfUiStp1DcbsuhzEzuYCdJBVvGTXmDDWpcAq1c';

export const fetchToken = (setTokenFound) => {
  const messaging = getMessaging();
  return getToken(messaging, {
    vapidKey: publicKey,
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          'No registration token available. Request permission to generate one.',
        );
        setTokenFound(false);
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