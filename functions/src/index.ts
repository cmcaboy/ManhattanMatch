// Cloud functions
//const path = require('path');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const Cors = require("cors");
const express = require("express");
const expressGraphQL = require('express-graphql');
//const schema = require('./schema/schema');
import schema from './schema/schema';
const fileUpload = require('./services/fileUpload');
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { printSchema } from 'graphql/utilities/schemaPrinter';

import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
// import { SubscriptionServer } from 'subscriptions-transport-ws';

const app = express();

// app.use('/graphql', expressGraphQL({
//   schema,
//   graphiql:true
// }));

// app.use(
//   "/graphql",
//   bodyParser.json(),
//   graphqlExpress({ schema, context: {} })
// )

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql/graphql' }));

app.use("/schema", (req, res) => {
  res.set("Content-Type", "text/plain")
  res.send(printSchema(schema))
})

exports.graphql = functions.https.onRequest(app);

const uploadImageToStorage = file => {
  const storage = admin.storage();
  return new Promise((resolve, reject) => {
      const fileUploadLocal = storage.bucket().file(file.originalname);
      const blobStream = fileUploadLocal.createWriteStream({
          metadata: {
              contentType: "image/jpg"
          }
      });

      blobStream.on("error", error => reject(error));

      blobStream.on("finish", () => {
          fileUploadLocal.getMetadata()
          .then(metadata => resolve(metadata))
          .catch(error => reject(error));
      });

  blobStream.end(file.buffer);
});
}

// Upload file to firebase storage
const api = express().use(Cors({ origin: true }));
  fileUpload("/picture", api);

  api.post("/picture", (req, response, next) => {
    console.log('pic upload req: ',req)
    uploadImageToStorage(req.files.file[0])
    .then(metadata => {
      response.status(200).json(metadata[0]);
      return next();
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error });
      next();
  });
});

exports.api = functions.https.onRequest(api);

exports.coords = functions.https.onRequest((req, res) => {
  console.log('req query: ',req.query);
  console.log('req params: ',req.params);
  
  res.send("Hello from Firebase!");
});

