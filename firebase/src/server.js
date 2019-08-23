// 'use strict';

// // imports node modules
// const express = require('express');


// // defines REST API (HTTP methods)

// // exports REST API
// module.exports = app;

// function addEntry(req, res) {
//     let userCollection = loadUserCollection(req.blogEntriesContext);

//     // save new entry to user collection
//     userCollection.save({
//         createdAt: new Date(),
//         description: req.body.description
//     }, () => res.end())
// }

// function getEntries(req, res) {
//     let userCollection = loadUserCollection(req.blogEntriesContext);

//     userCollection.find().sort({ createdAt: -1 }, (err, data) => {
//         res.status(err ? 500 : 200).send(err || data);
//     });
// }

// function deleteEntry(req, res) {
//     let userCollection = loadUserCollection(req.blogEntriesContext);

//     //removes a task based on its id
//     userCollection.remove({ _id: mongojs.ObjectId(req.query.id) }, () => res.end());
// }

// function loadUserCollection(blogEntriesContext) {
//     const AUTH0_SECRET = blogEntriesContext.secrets.AUTH0_SECRET;
//     const MONGO_USER = blogEntriesContext.secrets.MONGO_USER;
//     const MONGO_PASSWORD = blogEntriesContext.secrets.MONGO_PASSWORD;
//     const MONGO_URL = blogEntriesContext.secrets.MONGO_URL;

//     //removes the 'Bearer ' prefix that comes in the authorization header
//     let authorizationHeader = blogEntriesContext.headers.authorization;
//     authorizationHeader = authorizationHeader.replace('Bearer ', '');

//     //verfiies token authenticity
//     let token = jwt.verify(authorizationHeader, AUTH0_SECRET);
    
//     //connects to MongoDB and returns the user collection
//     let mongodb = mongojs(`${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}`);
//     return mongodb.collection(token.sub);
// }

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const jwt = require('jsonwebtoken');

// creates Express appServer with JSON body parser
const appServer = new express();
appServer.use(bodyParser.json());
appServer.get('/', getEntries);
appServer.post('/', addEntry);
// appServer.delete('/', deleteEntries);

// exports REST API
function addEntry(req, res) {
    let userCollection = loadUserCollection(req.firebaseContext);

    // save new entry to user collection
    userCollection.save({
        createdAt: new Date(),
        description: req.body.description
    }, () => res.end())
}

function getEntries(req, res) {
    let userCollection = loadUserCollection(req.firebaseContext);

    userCollection.find().sort({ createdAt: -1 }, (err, data) => {
        res.status(err ? 500 : 200).send(err || data);
    });
}

function loadUserCollection(firebaseContext) {
    const AUTH0_SECRET = functions.config().auth0_secret.value;
    const MONGO_USER = functions.config().mongo_user.value;
    const MONGO_PASSWORD = functions.config().mongo_password.value;
    const MONGO_URL = functions.config().mongo_url.value;

    //removes the 'Bearer ' prefix that comes in the authorization header
    let authorizationHeader = firebaseContext.headers.authorization;
    authorizationHeader = authorizationHeader.replace('Bearer ', '');

    //verfiies token authenticity
    let token = jwt.verify(authorizationHeader, AUTH0_SECRET);
    
    //connects to MongoDB and returns the user collection
    let mongodb = mongojs(`${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}`);
    return mongodb.collection(token.sub);
}

const simpleServer = express();
simpleServer.get('*', (request, response) => {
  response.send('Hello from Express on Firebase!');
});

const corsServer = express();
corsServer.use(cors({origin: true}));
corsServer.get('*', (request, response) => {
  response.send('Hello from Express on Firebase with CORS!');
});

const cleanPathServer = express();
cleanPathServer.use(cors({origin: true}));
cleanPathServer.get('*', (request, response) => {
  response.send(
    'Hello from Express on Firebase with CORS! No trailing \'/\' required!'
  );
});

module.exports = {
  simpleServer,
  corsServer,
  cleanPathServer,
  appServer
};