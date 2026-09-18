importScripts(
'https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js'
);

importScripts(
    'https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: "AIzaSyBvHXNpw7ESx3PyE2rNHiEHSV_4umkdxzQ",
  authDomain: "mankilam-barangay-system.firebaseapp.com",
  projectId: "mankilam-barangay-system",
  storageBucket: "mankilam-barangay-system.firebasestorage.app",
  messagingSenderId: "1076283922485",
  appId: "1:1076283922485:web:be8516137f17925bca397c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload)=> {
    console.log(
        '[firebase-messaging-sw.js] Background message: ',
        payload
    );

    const notificationTitle =
    payload.notification?.title || 'MankilamEase';

    const notificationOptions = {

        body:
        payload.notification?.body ||
        'You have a new notification.',

        icon: '/images/mankilamease.png'
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});
