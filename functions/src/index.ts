// Cloud functions
//const path = require('path');
const functions = require('firebase-functions');
//const admin = require('firebase-admin');
//const Cors = require("cors");
const express = require("express");
const expressGraphQL = require('express-graphql');
//const schema = require('./schema/schema');
import schema from './schema/schema';

const app = express();

const app1 = app.use('/graphql', expressGraphQL({
  schema,
  graphiql:true
}));

exports.graphql = functions.https.onRequest(app1);



