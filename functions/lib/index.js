var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Cloud functions
const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Cors = require("cors");
const express = require("express");
//const fileUpload = require(path.resolve(__dirname,"./fileUpload.js"));
const fileUpload = require('../src/fileUpload');
const Expo = require('expo-server-sdk');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const uploadImageToStorage = file => {
    const storage = admin.storage();
    return new Promise((resolve, reject) => {
        const fUpload = storage.bucket().file(file.originalname);
        const blobStream = fUpload.createWriteStream({
            metadata: {
                contentType: "image/jpg"
            }
        });
        blobStream.on("error", error => reject(error));
        blobStream.on("finish", () => {
            fUpload.getMetadata()
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
/*
exports.newQueue = functions.https.onRequest((req, res) => {

  const id = req.id;
  db.collection(`users`).get()
    .then((queueListData) => {
      const queueList = queueListData.data();
      const likeList = db.collection(`users/${id}/likes`)
        .then((likeListData) => {
          return likeListData.docs.map(doc => {
            const docData = doc.data();
            return {id:doc.id}
          })
        })
      const dislikeList = db.collection(`users/${id}/dislikes`)
        .then((dislikeListData) => {
          return dislikeListData.docs.map(doc => {
            const docData = doc.data();
            return {id:doc.id}
          })
        })
        const excludeList = [...likeList,...dislikeList];
        return queueList;
  })
  .catch((error) => console.log('error running query',error))
});
*/
exports.onMessageAdd = functions.firestore
    .document(`matches/{matchId}/messages/{messageId}`)
    .onCreate((event) => {
    const data = event.data.data();
    console.log('onCreate Message: ', data);
});
exports.hellowWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
exports.getMatches = functions.https.onRequest((req, res) => {
    const id = req.query.uid;
    // Takes in an id
    // Outputs that's id's matches
    // The matches come back with their unique id, their name, and their profile picture
    console.log('in getMatches');
    db.collection(`users`).where("active", "==", 1).get()
        .then((data) => {
        const userList = [];
        data.docs.forEach((doc) => {
            const userData = doc.data();
            userList[doc.id] = {
                name: userData.name,
                profilePic: userData.profilePic,
                description: userData.description,
                ancillaryPics: userData.ancillaryPics,
                school: userData.school,
                work: userData.work
            };
        });
        console.log('userList: ', userList);
        return db.collection(`users/${id}/matches`).where("active", "==", 1).get()
            .then((matchData) => {
            const matchList = matchData.docs.map((matchDatum) => {
                const match = matchDatum.data();
                console.log('match: ', matchDatum.id);
                return {
                    id: matchDatum.id,
                    name: userList[matchDatum.id].name,
                    profilePic: userList[matchDatum.id].profilePic,
                    matchId: match.matchId,
                    lastMessage: match.lastMessage,
                    lastUser: match.lastUser,
                    description: userList[matchDatum.id].description,
                    ancillaryPics: userList[matchDatum.id].ancillaryPics,
                    school: userList[matchDatum.id].school,
                    work: userList[matchDatum.id].work
                };
            });
            console.log('matchList: ', matchList);
            return res.send(matchList);
        })
            .catch((error) => console.log("Error writing document: ", error));
    })
        .catch((error) => console.log("Error writing document: ", error));
});
exports.getLikes = functions.https.onRequest((req, res) => {
    const id = req.query.uid;
    // Takes in an id
    // Outputs that's id's matches
    // The matches come back with their unique id, their name, and their profile picture
    console.log('Start getLikes');
    db.collection(`users`).get()
        .then((data) => {
        const userList = [];
        data.docs.forEach((doc) => {
            const userData = doc.data();
            userList[doc.id] = {
                name: userData.name,
                profilePic: userData.profilePic
            };
        });
        console.log('userList: ', userList);
        return db.collection(`users/${id}/likes`).get()
            .then((likeData) => {
            const likeList = likeData.docs.map((likeDatum) => {
                const like = likeDatum.data();
                console.log('like: ', like);
                console.log('user: ', userList[like.likedId]);
                return {
                    id: like.likedId,
                    name: userList[like.likedId].name,
                    profilePic: userList[like.likedId].profilePic
                };
            });
            return res.send(likeList);
        })
            .catch((error) => console.log("Error writing document: ", error));
    })
        .catch((error) => console.log("Error writing document: ", error));
});
exports.getDislikes = functions.https.onRequest((req, res) => {
    const id = req.query.uid;
    // Takes in an id
    // Outputs that's id's matches
    // The matches come back with their unique id, their name, and their profile picture
    db.collection(`users`).get()
        .then((data) => {
        const userList = [];
        data.docs.forEach((doc) => {
            const userData = doc.data();
            userList[doc.id] = {
                name: userData.name,
                profilePic: userData.profilePic
            };
        });
        return db.collection(`users/${id}/dislikes`).get()
            .then((dislikeData) => {
            const dislikeList = dislikeData.docs.map((dislikeDatum) => {
                const dislike = dislikeDatum.data();
                return {
                    id: dislike.dislikedId,
                    name: userList[dislike.dislikedId].name,
                    profilePic: userList[dislike.dislikedId].profilePic
                };
            });
            return res.send(dislikeList);
        })
            .catch((error) => console.log("Error writing document: ", error));
    })
        .catch((error) => console.log("Error writing document: ", error));
});
exports.oldNewQueue = functions.https.onRequest((req, res) => {
    return db.collection(`users`).get()
        .then((queueList) => {
        // Firestore document id's can be obtained with the .id property.
        const newList = queueList.docs.map(doc => {
            const docData = doc.data();
            return {
                id: doc.id,
                name: docData.name,
                profilePic: docData.profilePic
            };
        });
        return res.send(newList);
    })
        .catch((error) => console.log("Error writing document: ", error));
    //response.send("Hello from Firebase!");
});
// Execute after a like. check to see if the liked user also like the user.
/*
exports.lastMessageUpdate = functions.firestore
  .document(`matches/{matchId}/messages/{messageId}`)
  .onCreate((event) => {
    const data = event.data.data();
    const matchId = event.params.matchId;
    const lastMessage = data.text;
    const lastUser = data.name;
    console.log('matchId: ',matchId);
    console.log('lastMessage: ',lastMessage);
    console.log('lastUser: ',lastUser);

    updateLastMessage(matchId,lastMessage);
    updateLastUser(matchId,lastUser);
  })
*/
// Take the last message from the match conversation and place
// it in the user's profile under matches.
const updateLastMessage = (matchId, lastMessage, res) => {
    return db.collection(`matches`).doc(`${matchId}`).get()
        .then((snapshot) => {
        const matchData = snapshot.data();
        //console.log('matchData: ',matchData);
        const userA = matchData.userA;
        //console.log('userA: ',userA);
        const userB = matchData.userB;
        //console.log('userB: ',userB);
        const lastMessageCall = db.collection(`users/${userA}/matches`).doc(`${userB}`)
            .update({ lastMessage });
        const lastMessageCall2 = db.collection(`users/${userB}/matches`).doc(`${userA}`)
            .update({ lastMessage });
        return Promise.all([lastMessageCall, lastMessageCall2])
            .then(() => res.send("Update Successful"))
            .catch((e) => res.send("Update Failed: ", e));
    })
        .catch((error) => console.log('Error updating user: ', error));
};
const updateLastUser = (matchId, lastUser, res) => {
    return db.collection(`matches`).doc(`${matchId}`).get()
        .then((snapshot) => {
        const matchData = snapshot.data();
        console.log('matchData: ', matchData);
        const userA = matchData.userA;
        console.log('userA: ', userA);
        const userB = matchData.userB;
        console.log('userB: ', userB);
        const lastUserCall = db.collection(`users/${userA}/matches`).doc(`${userB}`)
            .update({ lastUser });
        const lastUserCall2 = db.collection(`users/${userB}/matches`).doc(`${userA}`)
            .update({ lastUser });
        return Promise.all([lastUserCall, lastUserCall2])
            .then(() => res.send("Update Successful"))
            .catch((e) => res.send("Update Failed: ", e));
    })
        .catch((error) => console.log('Error updating user: ', error));
};
exports.putLastMessage = functions.https.onRequest((req, res) => {
    //console.log('matchId: ',req.query.matchId);
    //console.log('message: ',req.query.message);
    updateLastMessage(req.query.matchId, req.query.message, res);
});
exports.putLastName = functions.https.onRequest((req, res) => {
    //console.log('matchId: ',req.query.matchId);
    //console.log('name: ',req.query.name);
    updateLastUser(req.query.matchId, req.query.lastName, res);
});
// If active indicator on a match gets altered, adjust the match
// Indicators on the user's profile.
exports.onMatchShowHide = functions.firestore
    .document(`matches/{matchId}`)
    .onUpdate((event) => {
    const newValue = event.data.data();
    const oldValue = event.data.previous.data();
    const matchId = event.params.matchId;
    if (newValue.active === 0 && oldValue.active === 1) {
        // Deactivate Matches
        db.collection(`users/${newValue.userA}/matches/`).where("matchId", "==", matchId)
            .update({ active: 0 });
        db.collection(`users/${newValue.userB}/matches/`).where("matchId", "==", matchId)
            .update({ active: 0 });
    }
    else if (newValue.active === 1 && oldValue.active === 0) {
        // Activate Matches
        db.collection(`users/${newValue.userA}/matches/`).where("matchId", "==", matchId)
            .update({ active: 1 });
        db.collection(`users/${newValue.userB}/matches/`).where("matchId", "==", matchId)
            .update({ active: 1 });
    }
});
const sendNotification = (id, messageBody, title) => __awaiter(this, void 0, void 0, function* () {
    const doc = yield db.collection(`users`).doc(`${id}`).get();
    if (!doc.exists) {
        console.log('User does not exist: ', id);
        return;
    }
    const user = doc.data();
    // If user has elected to receive notifications and we have a token on file
    if (!!user.sendNotifications && !!user.token) {
        // Send a push notification
        const expo = new Expo();
        const message = [{
                to: user.token,
                sound: 'default',
                body: messageBody,
                data: { message: `${title} - ${messageBody}` }
            }];
        console.log('message: ', message);
        const chunks = expo.chunkPushNotifications(message);
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (const chunk of chunks) {
            try {
                console.log('chunk: ', chunk);
                const receipts = yield expo.sendPushNotificationsAsync(chunk);
                console.log('receives: ', receipts);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
});
// Helper function to create a new match
const createMatch = (a, b) => {
    // create a match between userId's a and b
    const ref = db.collection(`matches`).doc();
    ref.set({
        id: ref.id,
        userA: a,
        userB: b,
        matchTime: Date.now(),
        active: 1
    });
    db.collection(`users`).doc(`${a}`).get()
        .then((snapshot) => {
        //const data = snapshot.data();
        return db.collection(`users/${b}/matches`).doc(`${a}`).set({
            matchId: ref.id,
            active: 1
        });
    })
        .catch((error) => console.log('error: ', error));
    db.collection(`users`).doc(`${b}`).get()
        .then((snapshot) => {
        //const data = snapshot.data();
        return db.collection(`users/${a}/matches`).doc(`${b}`).set({
            matchId: ref.id,
            active: 1
        });
    })
        .catch((error) => console.log('error: ', error))
        .catch((error) => console.log('error: ', error));
    sendNotification(a, 'You have a new match. Congrats!', 'New Match!')
        .then(() => console.log('Notification sent to ', a))
        .catch(e => console.log(`Error sending notification to ${a}: `, e));
    sendNotification(b, 'You have a new match. Congrats!', 'New Match!')
        .then(() => console.log('Notification sent to ', b))
        .catch(e => console.log(`Error sending notification to ${b}: `, e));
};
exports.onLike = functions.firestore
    .document(`users/{userId}/likes/{likeId}`)
    .onCreate((event) => {
    const data = event.data.data();
    const userId = event.params.userId;
    const likedId = data.likedId;
    db.collection(`users/${likedId}/likes`).get()
        .then((likeList) => {
        return likeList.docs.forEach((doc) => {
            const docData = doc.data();
            if (docData.likedId === userId) {
                createMatch(userId, likedId);
            }
        });
    }) // end .then
        .catch((error) => console.log('error', error));
});
/*
  const getCityName = (lat,lon) => fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`)
         .then((data) => data.json())
         .then((response) => console.log('response: ',response.results[0].formatted_address.split(',')[1]))
         .catch((error) => console.log('error: ',error));
*/
const deg2rad = (deg) => deg * (Math.PI / 180);
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    const m = d * 0.62137;
    return m;
};
const generateNewQueue = (id, OppositeGender, lat, lon, radius, exceptionsParam) => __awaiter(this, void 0, void 0, function* () {
    const DEBUG = 0;
    const MAX_QUEUE_SIZE = 50;
    const exceptions = !!exceptionsParam ? exceptionsParam : [];
    const queryList = yield db.collection(`users`)
        .where("active", "==", 1)
        .where("gender", "==", OppositeGender)
        .get();
    console.log('after queryList');
    console.log('id: ', id);
    console.log('OppositeGender: ', OppositeGender);
    console.log('lat: ', lat);
    console.log('lon: ', lon);
    console.log('radius: ', radius);
    let list = queryList.docs.map((doc) => {
        const docData = doc.data();
        console.log('docData: ', docData);
        return {
            id: doc.id,
            name: docData.name,
            school: docData.school,
            work: docData.work,
            description: docData.description,
            profilePic: docData.profilePic,
            ancillaryPics: docData.ancillaryPics,
            coords: docData.coords
        };
    });
    console.log('list: ', list);
    const likeList = yield db.collection(`users/${id}/likes`).get();
    console.log('after likeList');
    const likes = likeList.docs.map((doc) => {
        const docData = doc.data();
        return docData.likedId;
    });
    console.log('likes: ', likes);
    const dislikeList = yield db.collection(`users/${id}/dislikes`).get();
    console.log('after dislikes');
    const dislikes = dislikeList.docs.map((doc) => {
        const docData = doc.data();
        return docData.dislikedId;
    });
    console.log('dislikes: ', dislikes);
    const excludeList = new Set([...likes, ...dislikes, ...exceptions, id]);
    list = new Set([...list]);
    console.log('list after sets: ', list);
    console.log('excludeList: ', excludeList);
    const queueList = [...list]
        .filter(x => !excludeList.has(x.id))
        .map((x) => {
        const distanceApart = getDistance(x.coords.latitude, x.coords.longitude, lat, lon);
        console.log('distanceApart: ', isNaN(distanceApart) ? 0 : distanceApart);
        console.log('name: ', x.name);
        return Object.assign({}, x, { distanceApart });
    })
        .filter((x) => (isNaN(x.distanceApart) ? 0 : x.distanceApart) <= radius)
        .slice(0, MAX_QUEUE_SIZE);
    console.log('queueList: ', queueList);
    // put items onto user's queue subcollection
    queueList.forEach((doc) => {
        db.collection(`users/${id}/queue`).doc(`${doc.id}`).set(doc)
            .then(() => console.log(`${doc.id} added to ${id} queue`))
            .catch((e) => console.log(`Error writing ${doc.id} to ${id} queue: `, e));
    });
    // return list
    return queueList;
});
exports.getQueue = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const DEBUG = 1;
    const QUEUE_SIZE = 10;
    console.log('getQueue');
    console.log('req: ', req.query);
    // Check to see if queue exists
    const id = req.query.id;
    const OppositeGender = req.query.OppositeGender;
    //const currentLocation = req.query.coords;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const radius = req.query.radius;
    console.log('id: ', id);
    console.log('OppositeGender: ', OppositeGender);
    console.log('lat: ', lat);
    console.log('lon: ', lon);
    console.log('radius: ', radius);
    let isEmpty = false;
    let currentList;
    try {
        currentList = yield db.collection(`users/${id}/queue`).get();
        isEmpty = currentList.docs.length > 0 ? false : true;
    }
    catch (e) {
        console.log('error fetch queueList: ', e);
        isEmpty = true;
    }
    ;
    console.log('isEmpty: ', isEmpty);
    if (!isEmpty) { // if a queue exists
        // Send some more items from the queue
        const queueList = currentList.docs.slice(0, QUEUE_SIZE).map((doc) => doc.data());
        console.log('queueList: ', queueList);
        // Remove items from the queue
        /*
        currentList.docs.slice(QUEUE_SIZE).forEach(doc => {
          db.collection(`users/${id}/queue`).doc(`${doc.id}`).delete()
            .then(() => console.log(`queue document ${doc.id} for user ${id} deleted.`))
            .catch((e) => console.log('Error removing document: ',e))
        });
        */
        // send queuelist back to the client
        res.send(queueList);
        // Get new queue ready
        yield generateNewQueue(id, OppositeGender, lat, lon, radius, queueList);
    }
    else {
        // If the queue is empty, generate a new queue
        const queueList = yield generateNewQueue(id, OppositeGender, lat, lon, radius, []);
        console.log('sending queue to client: ', queueList);
        res.send(queueList.slice(0, QUEUE_SIZE));
        // Get new queue ready
        yield generateNewQueue(id, OppositeGender, lat, lon, radius, queueList);
    }
}));
//# sourceMappingURL=index.js.map