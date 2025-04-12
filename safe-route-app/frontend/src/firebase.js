import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBZUW43ZQknEt4QhKb7cMWbuv4Wk7y9rxw",
    authDomain: "emergency-services-e11f3.firebaseapp.com",
    projectId: "emergency-services-e11f3",
    storageBucket: "emergency-services-e11f3.firebasestorage.app",
    messagingSenderId: "471038091024",
    appId: "1:471038091024:web:0dd4bea29920c7a0784f95"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);