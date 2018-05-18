// Cloud functions
const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const Cors = require("cors");
const express = require("express");
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

const driver = require('./db/neo4j');
const session = driver.session();

const app1 = app.use('/graphql', expressGraphQL({
  schema,
  graphiql:true
}));
// graphiql is a development variable that is only used in development environments.

const graphql = functions.https.onRequest(app1);

app.listen(4000,() => {
  console.log('Listening');
});



