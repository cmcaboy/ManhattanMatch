  import * as firebase from 'firebase';
  import 'firebase/firestore';
  import moment from 'moment';
  import uuid from 'uuid';
  import {FIREBASE_CONFIG} from '../variables/sensitive';
  
  // Initialize Firebase
  const config = FIREBASE_CONFIG;
  firebase.initializeApp(config);

  const database = firebase.database();
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  // Practice

  
  const db = firebase.firestore();
  
/*
  console.log('in firebase script');
  
  db.collection(`users`).doc(`${newUser.uid}`).set({...newUser})
        .then(() => console.log(`update complete`))
        .catch((error) => console.log("Error writing document: ",error));

  db.collection(`users`).get()
        .then((data) => data.forEach((datum) => console.log(datum.data())))
        .catch((error) => console.log("Error writing document: ",error));
*/
  export { firebase, googleAuthProvider,db, database as default };
