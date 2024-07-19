import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth} from "firebase/auth";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVrH1ts7UmaovO27gUujZ9-ojnXASzKcU",
  authDomain: "myapp-c20f4.firebaseapp.com",
  projectId: "myapp-c20f4",
  storageBucket: "myapp-c20f4.appspot.com",
  messagingSenderId: "796352421221",
  appId: "1:796352421221:web:8535c98996f1674dcbd58c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export {fireDB,auth,storage } ;