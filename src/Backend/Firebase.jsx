// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//! import all the service that u want
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// !Initialize Firebase
const firebaseApp= initializeApp(firebaseConfig);

export let __AUTH = getAuth(firebaseApp)
export let __DB = getFirestore(firebaseApp)

// ! Admin Panel Toggle: Instant display after auth state is confirmed
document.addEventListener("DOMContentLoaded", () => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    console.log("USER:", user?.email);

    if (user && user.email === "abishaisingh1@gmail.com") {
      document.getElementById("adminPanel").style.display = "block";
    } else {
      document.getElementById("adminPanel").style.display = "none";
    }
  });
});
