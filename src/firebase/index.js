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

  const db = firebase.firestore();
  
  export { firebase, googleAuthProvider,db, database as default };
