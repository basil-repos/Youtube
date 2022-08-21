import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAMr5Vn5v01qkxrxyGe3O3hnisJA6wxSsg",
  authDomain: "video-app-45a37.firebaseapp.com",
  projectId: "video-app-45a37",
  storageBucket: "video-app-45a37.appspot.com",
  messagingSenderId: "910660087876",
  appId: "1:910660087876:web:871f7c35044e6e217acc11",
  measurementId: "G-FF7EBSZFFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;