import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Move credentials to environment variables. Leaving this here for now
// to make local development easier.
const firebaseConfig = {
  apiKey: "AIzaSyAAfnkkdkKxQiWjkfDtbvi0ufIeLL1BYDs",
  authDomain: "realtime-doc-6a55e.firebaseapp.com",
  projectId: "realtime-doc-6a55e",
  storageBucket: "realtime-doc-6a55e.appspot.com",
  messagingSenderId: "88815339826",
  appId: "1:88815339826:web:102912cc93a4fa6b636f2b",
  measurementId: "G-TQBPV1XYEK",
};

const firebaseApp = initializeApp(firebaseConfig);
const FirebaseDb = getFirestore(firebaseApp);

export default FirebaseDb;
