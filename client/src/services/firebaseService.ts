import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUh2OmAZNophSxELqLge2h9yaando8UwY",
  authDomain: "recipebook-apps.firebaseapp.com",
  projectId: "recipebook-apps",
  storageBucket: "recipebook-apps.firebasestorage.app",
  messagingSenderId: "66381470156",
  appId: "1:66381470156:web:766e60e721ee8cc6ea6569",
  measurementId: "G-F2DWKS8K6D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<string> {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return idToken;
}