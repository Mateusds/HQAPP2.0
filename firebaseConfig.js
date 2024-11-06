import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando o AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyAY5kD5w98NzmwBeflPJi45SRvccM9Wgow",
  authDomain: "hq-app-e2179.firebaseapp.com",
  projectId: "hq-app-e2179",
  storageBucket: "hq-app-e2179.appspot.com",
  messagingSenderId: "569780395115",
  appId: "1:569780395115:web:62039f74494fe2af72652e"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o Firebase Auth com persistência usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Usando AsyncStorage para persistência
});

// Inicializando o Firestore
const firestore = getFirestore(app);

// Para compatibilidade, mantendo a variável db (como estava no código original)
const db = getFirestore(app);

export { auth, db, firestore };
