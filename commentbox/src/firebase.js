// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

    apiKey: "AIzaSyCPnIYryp_c4rCldViuebaXiu7DI6P0_Uk",

    authDomain: "comment-box-84089.firebaseapp.com",

    projectId: "comment-box-84089",

    storageBucket: "comment-box-84089.firebasestorage.app",

    messagingSenderId: "425901584925",

    appId: "1:425901584925:web:9a71288c78ca9ca23e4cf4",

    measurementId: "G-VG2ZLPMNH7"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);