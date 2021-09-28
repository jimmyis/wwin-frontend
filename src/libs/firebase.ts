import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDl7u-Fx-PFiysr8SEVVIxAkSkM2hyFbQw",
  authDomain: "wwin-mainnet.firebaseapp.com",
  projectId: "wwin-mainnet",
  storageBucket: "wwin-mainnet.appspot.com",
  messagingSenderId: "767713616013",
  appId: "1:767713616013:web:4ff215118b66dc1692c2c4",
  measurementId: "G-07E3T94YPM"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore()
