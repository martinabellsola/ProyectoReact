import app from 'firebase/app'

import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCAOgtEUirNLmzslbNmMdIAvY_4xibB82M",
    authDomain: "proyectoreact-f393d.firebaseapp.com",
    projectId: "proyectoreact-f393d",
    storageBucket: "proyectoreact-f393d.appspot.com",
    messagingSenderId: "904550859870",
    appId: "1:904550859870:web:ad523af13b4e26343360cf"
  }; 

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();