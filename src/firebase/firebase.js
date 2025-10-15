import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCcD91HZIRdphH2_VZ0WV6kgjPPMy3R558",
  authDomain: "insta-clone-b8ccf.firebaseapp.com",
  projectId: "insta-clone-b8ccf",
  storageBucket: "insta-clone-b8ccf.firebasestorage.app",
  messagingSenderId: "331355228455",
  appId: "1:331355228455:web:3f9e321236ac2c53834102",
  measurementId: "G-8VRX13RT2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {app, auth, firestore, storage};