import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";
import shortid from "shortid";

export const firebaseConfig = {
  apiKey: "AIzaSyCPIYMQmXx4B9txY95SF4I5fFlvmEdaXc0",
  authDomain: "ambutap-fd06c.firebaseapp.com",
  databaseURL: "https://ambutap-fd06c.firebaseio.com",
  projectId: "ambutap-fd06c",
  storageBucket: "ambutap-fd06c.appspot.com",
  messagingSenderId: "330320210378",
  appId: "1:330320210378:web:8b41d5814001535b734733",
  measurementId: "G-DG44LHHK8J"
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
    this.database = firebase.database();
    this.storage = firebase.storage();
  }

  signIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.auth.signOut();
  }

  timestampFromDate(date) {
    return firebase.firestore.Timestamp.fromDate(date);
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  createRef(refPath, data) {
    return this.database.ref(refPath).set(data);
  }

  getRef(refPath) {
    return this.database
      .ref(refPath)
      .once("value")
      .then(snap => snap.val());
  }

  getAllRefs(refPath){
    let refs = [];
    this.database
      .ref(refPath)
      .on("value", snapshot => {
        let data = snapshot.val();
        try {
          Object.keys(data).forEach(key => {
            let ref_data = { ...data[key], id: key };
            refs.push(ref_data);
          });
        } catch (error) {
          console.log(error);
        }
      });
    return refs;
  }

  getRefsByAttribute(refPath, attribute, equalTo) {
    let refs = [];
    this.database
      .ref(refPath)
      .orderByChild(attribute)
      .equalTo(equalTo)
      .on("value", snapshot => {
        let data = snapshot.val();
        try {
          Object.keys(data).forEach(key => {
            let ref_data = { ...data[key], id: key };
            refs.push(ref_data);
          });
        } catch (error) {
          console.log(error);
        }
      });
    return refs;
  }

  updateRef(refPath, data) {
    return this.database.ref(refPath).update(data);
  }

  deleteRef(refPath) {
    return this.database.ref(refPath).remove();
  }

  createUserWithEmailAndPassword(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  sendPasswordResetEmail(email) {}

  getCurrentUser() {
    return this.auth.currentUser;
  }

  uploadFile(refPath, file, fname = null) {
    let storageRef = this.storage.ref();
    let fileName = fname !== null ? fname : `${shortid.generate()}`;
    return storageRef.child(`${refPath}/${fileName}`).put(file);
  }

  getCredentialFromJSON(object) {
    return firebase.auth.AuthCredential.fromJSON(object);
  }
}

export default new Firebase();
