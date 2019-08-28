const cors = require('cors');
const functions = require('firebase-functions');

// Express Servers
const {appServer, cleanPathServer} = require('./server');

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
// const corsPath = functions.https.onRequest(corsServer);
const cleanPath = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`; // Prepend '/' to keep query params if any
  }
  return cleanPathServer(request, response);
});

module.exports = {
  app,
  cleanPath,
};