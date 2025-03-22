// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIXUbg4Hr-QtAjb96wEESI5Ab8d80XKHc",
    authDomain: "mess-manager-pro-e7fc2.firebaseapp.com",
    databaseURL: "https://mess-manager-pro-e7fc2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mess-manager-pro-e7fc2",
    storageBucket: "mess-manager-pro-e7fc2.firebasestorage.app",
    messagingSenderId: "439834632185",
    appId: "1:439834632185:web:ab890eb04ae8976d476728",
    measurementId: "G-Q6BFQCRGEM"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export Firebase instances
export { app, auth, database }; 