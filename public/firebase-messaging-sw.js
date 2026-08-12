// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDGe2xnJ42Z2UEGbTAxv1Gwgk_i-y5EmD4",
  authDomain: "la-poderosa-4b6ab.firebaseapp.com",
  projectId: "la-poderosa-4b6ab",
  storageBucket: "la-poderosa-4b6ab.firebasestorage.app",
  messagingSenderId: "933466346353",
  appId: "1:933466346353:web:586c946ce054c3278a1cd0"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejar notificaciones cuando la app está en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificación recibida: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    data: { url: payload.data?.url || '/' }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Al hacer clic en la notificación, abrir la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || 'https://lapoderosa.co/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});