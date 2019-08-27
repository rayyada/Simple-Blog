'use strict';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
// const mongojs = require('mongojs');
const mongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const functions = require('firebase-functions');

// creates Express appServer with JSON body parser
const appServer = new express();
appServer.use(cors({origin: true}));
appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({ extended: true }));
// appServer.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   if ('OPTIONS' == req.method) {
//      res.sendStatus(200);
//    }
//    else {
//      next();
//    }});
// appServer.delete('/', deleteEntries);

var database, collection;

appServer.get('/', getEntries);
appServer.post('/', addEntry);

// exports REST API
function addEntry(req, res) {
    // let userCollection = loadUserCollection(req);
    // console.log(userCollection);
    // save new entry to user collection
    // userCollection.save({
    //     createdAt: new Date(),
    //     description: req.body.description
    // }, () => res.end())
    
  loadUserCollection(req, () => {
    collection.insertOne(req.body, (error, result) => {
      if(error) {
          return res.status(500).send(error);
      }
      res.send(result.result);
    });
  });
}

function getEntries(req, res) {
  // console.log(req.body);
  // console.log(res);
  loadUserCollection(req, () => {
      collection.find({}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
  });
}

// function deleteEntry(req, res) {
//     let userCollection = loadUserCollection(req.blogEntriesContext);

//     //removes a task based on its id
//     userCollection.remove({ _id: mongojs.ObjectId(req.query.id) }, () => res.end());
// }


function loadUserCollection(firebaseContext, callback) {
    // const AUTH0_SECRET = functions.config().auth0_secret.value;
    // const MONGO_USER = functions.config().mongo_user.value;
    // const MONGO_PASSWORD = functions.config().mongo_password.value;
    // const MONGO_URL = functions.config().mongo_url.value;

    //removes the 'Bearer ' prefix that comes in the authorization header
    // let authorizationHeader = firebaseContext.headers.authorization;
    // authorizationHeader = authorizationHeader.replace('Bearer ', '');

    //verfiies token authenticity
    // let token = jwt.verify(authorizationHeader, AUTH0_SECRET);
    
    //connects to MongoDB and returns the user collection
      console.log("Before connecting to Github-Project!");
      // let uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}`;
      let uri = 'mongodb+srv://admin:qQUDijlYW9ZJFzw0@simple-blog-9pj6l.mongodb.net/test?retryWrites=true&w=majority';
      // let uri = 'mongodb+srv://testUser:GIbxNbaxmN9QhAMa@simple-blog-9pj6l.mongodb.net/test?retryWrites=true&w=majority';
    mongoClient.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    (error, client) => {
      if(error) {
        throw error;
      }
      database = client.db("simple-blog");
      collection = database.collection("blog-entries");
      console.log("Connected to Github-Project!");
      // console.log(database);
      // console.log(collection);
      // client.close();
      // console.log("Connection closed");
      callback();
      // return collection;
    });

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
  appServer,
  cleanPathServer,
  simpleServer,
  corsServer,
};


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