// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBBS7Dak6ej5uCSSlZD8fnuVwJj3YpfCDo",
    authDomain: "anotacoes-lanmaster.firebaseapp.com",
    projectId: "anotacoes-lanmaster",
    storageBucket: "anotacoes-lanmaster.firebasestorage.app",
    messagingSenderId: "18119327553",
    appId: "1:18119327553:web:907975abcbea911be7abc0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);