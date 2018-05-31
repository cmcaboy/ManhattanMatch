"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Cloud functions
//const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Cors = require("cors");
const express = require("express");
const expressGraphQL = require('express-graphql');
//const schema = require('./schema/schema');
const schema_1 = require("./schema/schema");
const fileUpload = require('./services/fileUpload');
const app = express();
const app1 = app.use('/graphql', expressGraphQL({
    schema: schema_1.default,
    graphiql: true
}));
exports.graphql = functions.https.onRequest(app1);
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
};
// Upload file to firebase storage
const api = express().use(Cors({ origin: true }));
fileUpload("/picture", api);
api.post("/picture", (req, response, next) => {
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
//# sourceMappingURL=index.js.map