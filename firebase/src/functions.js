const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp();

// Express Servers
const {appServer, simpleServer, corsServer, cleanPathServer} = require('./server');

// HTTP Cloud Functions
const app = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`; // Prepend '/' to keep query params if any
  }
  return appServer(request, response);
});
// const app = functions.https.onRequest(request, response); => {
//   if (!request.path) {
//     request.url = `/${request.url}`; // Prepend '/' to keep query params if any
//   }

//   return appServer(request, response);
// });
const corsPath = functions.https.onRequest(corsServer);
const cleanPath = functions.https.onRequest((request, response) => {
  return cleanPathServer(request, response);
});

module.exports = {
  app,
  cleanPath,
  simplePath,
  corsPath,
};