/*
  IMPORTANT — one-time edit needed before you upload this file:

  Replace the placeholder values below with the exact Firebase config
  shown in your Firebase console (Project settings → General → Your apps →
  the web app → SDK setup and configuration). This has to be hardcoded
  here (rather than typed into the app's Settings screen) because this
  file runs in the background, separately from the page, and can't read
  anything you've typed into the app itself.

  This is the SAME config object you'll paste into the app's Settings
  screen — just copy it twice, once there and once here.
*/
importScripts("https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT_ID_HERE.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
});

var messaging = firebase.messaging();

// Shows the notification when a push arrives while the app isn't open.
// This is the ONLY place the notification gets displayed — the Cloud
// Function sends a data-only message (no "notification" field) so
// nothing shows up automatically and duplicates this.
//
// The title is intentionally left blank: iOS always shows its own
// "from [App Name]" label on push notifications (a security label that
// can't be turned off), so giving it a matching title of our own just
// produces a redundant duplicate line. Leaving it blank means the OS's
// own app-name label is the only title shown, with the message below it.
messaging.onBackgroundMessage(function(payload){
  var options = {
    body: (payload.data && payload.data.body) || "Time to check in on Ringo.",
    tag: "good-days-reminder"
  };
  self.registration.showNotification("", options);
});

// Tapping the notification opens (or focuses) the app.
self.addEventListener("notificationclick", function(event){
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({type:"window", includeUncontrolled:true}).then(function(clientList){
      for(var i=0;i<clientList.length;i++){
        if("focus" in clientList[i]) return clientList[i].focus();
      }
      if(self.clients.openWindow) return self.clients.openWindow("./index.html");
    })
  );
});
