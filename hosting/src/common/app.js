import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";


export default firebase.initializeApp(require('../../firebase-config'));
