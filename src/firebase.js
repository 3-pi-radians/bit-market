import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyBiszzD9QvGMScWTzlMPNlRiRoz7l5u1Q4",
    authDomain: "bit-market-f5569.firebaseapp.com",
    projectId: "bit-market-f5569",
    storageBucket: "bit-market-f5569.appspot.com",
    messagingSenderId: "230402276288",
    appId: "1:230402276288:web:8997d1a6a0fe05425a6625"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseDb = getFirestore(firebaseApp);

  export {firebaseApp, firebaseDb};