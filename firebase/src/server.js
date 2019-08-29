'use strict';
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// mongoDB dependencies
// const mongojs = require('mongojs');
// const mongoClient = require('mongodb').MongoClient;
// const objectID = require('mongodb').ObjectID;

//Initialize Cloud Firestore instance
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

// creates Express appServer with JSON body parser
const appServer = new express();
appServer.use(cors({origin: true}));
appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({ extended: false }));

appServer.get('*', getEntries);
appServer.post('*', addEntry);
appServer.delete('*', deleteEntry);

var database, collection, blogEntriesCollection;

// exports REST API
function addEntry(req, res) {

  //initialize variable to add to collection
  const { createdOn, createdBy, updatedOn, updatedBy, contents, } = req.body;
  const data = {
    contents, createdBy, createdOn, updatedBy, updatedOn
  };

  let verified;
  verified = tokenVerification(req);
  
  if(verified) {
    // add document, then return data from document
    db.collection('blog-entries').add(data)
    .then((blogEntryRef) => {
      return blogEntryRef.get();
    })
    .then((blogEntry) => {
    
      res.json({
        id: blogEntry.id,
        data: blogEntry.data()
      });
      return blogEntry;
    })
    .catch(error => {
      console.log('Error in addEntry');
      res.send(error);
    });
  } else {
    res.send("unverified");
  }
}

function getEntries(req, res) {
  // bypass auth0 token verification if running firebase emulator
  let verified;
  verified = tokenVerification(req);
  
  if(verified) {
    // get documents in collection and store in array to return
    db.collection('blog-entries').get()
    .then((blogsSnapshot) => {
      const blogs = [];
      blogsSnapshot.forEach(
          (doc) => {
            blogs.push({
                  id: doc.id,
                  data: doc.data()
              });
          }
      );
      res.send(blogs);
      return blogs;
    })
    .catch(error => {
      console.log('Error in getEntries');
      res.send(error);
    });
  } else {
    return res.send("unverified");
  }
}

function deleteEntry(req, res) {
  let verified;
  verified = tokenVerification(req);

  if(verified) {
    // delete document from collection and return confirmation data
    db.collection('blog-entries').doc(req.query.id).delete()
    .then((confirmation) => {
      res.send(confirmation);
      return confirmation;
    })
    .catch(error => {
      console.log('Error in deleteEntry');
      res.send(error);
    });
  } else {
    res.send("unverified");
  }
}


function tokenVerification(req) {
  let authorizationHeader = req.headers.authorization;
  return authorizationHeader === undefined ? undefined : authorizationHeader.replace('Bearer ', '');
}


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
};

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

// function mongooDBConnect() {
//     //connects to MongoDB and returns the user collection
//       console.log("Before connecting to Github-Project!");
//       // let uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}`;
//       let uri = 'mongodb+srv://admin:qQUDijlYW9ZJFzw0@simple-blog-9pj6l.mongodb.net/test?retryWrites=true&w=majority';
//       // let uri = 'mongodb+srv://testUser:GIbxNbaxmN9QhAMa@simple-blog-9pj6l.mongodb.net/test?retryWrites=true&w=majority';
//     mongoClient.connect(uri, 
//     { useNewUrlParser: true, useUnifiedTopology: true }, 
//     (error, client) => {
//       if(error) {
//         throw error;
//       }
//       database = client.db("simple-blog");
//       collection = database.collection("blog-entries");
//       console.log("Connected to Github-Project!");
//       // client.close();
//       callback();
//     });
// }