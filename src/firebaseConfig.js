import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyAXUwmqt3HZP2jf0QIaE1r7C9yOVbwPBHE",
  authDomain: "bwd-invoicing.firebaseapp.com",
  databaseURL: "https://bwd-invoicing.firebaseio.com",
  projectId: "bwd-invoicing",
  storageBucket: "bwd-invoicing.appspot.com",
  messagingSenderId: "890234333505",
  appId: "1:890234333505:web:d40ce5a9243bac12e459c0",
  measurementId: "G-020QSSKEYM"
};

// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

const settings = {};
db.settings(settings);

export { db, auth, currentUser };
