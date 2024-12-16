import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase config for the first project
const firebaseConfig1 = {
  apiKey: "AIzaSyCrWgHtAj5sik2Ap-DFUdY1cGsUosKvt0g",
  authDomain: "exelk-erp.firebaseapp.com",
  projectId: "exelk-erp",
  storageBucket: "exelk-erp.appspot.com",
  messagingSenderId: "806104452555",
  appId: "1:806104452555:web:e84caf2cdcb6c25eb77a4e",
  measurementId: "G-HR4SJ9VSD7"
};

// Firebase config for the second project
const firebaseConfig = {
  apiKey: "AIzaSyCqqWg6b5Rl7jc4TemsKWLYfAZuSGZ1CqA",
  authDomain: "restaurant-pos-cde80.firebaseapp.com",
  projectId: "restaurant-pos-cde80",
  storageBucket: "restaurant-pos-cde80.firebasestorage.app",
  messagingSenderId: "824385352336",
  appId: "1:824385352336:web:750ac7794cb1096faa9e15",
  measurementId: "G-VEY2YDZCL2"
};;

// Initialize the first app with a unique name
const app1 = initializeApp(firebaseConfig1, "app1");

// Initialize the second app with a unique name (DEFAULT is the default app)
const app = initializeApp(firebaseConfig, "app");

// Get the services for both apps
const auth = getAuth(app); // Default app
const firestore = getFirestore(app); // Default app
const storage = getStorage(app1); // App1 storage
const database = getDatabase(app); // Default app

export { app, auth, firestore, storage, database };
