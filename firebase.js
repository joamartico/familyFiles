// import firebase from "firebase";


import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
	apiKey: "AIzaSyAXw0c8iUAASzUoTsBzrRFmKeapczdGluE",
	authDomain: "archivosfamiliares-55cc2.firebaseapp.com",
	projectId: "archivosfamiliares-55cc2",
	storageBucket: "archivosfamiliares-55cc2.appspot.com",
	messagingSenderId: "794658339373",
	appId: "1:794658339373:web:39dcf72ca5dd7517de16a4",
	measurementId: "G-8CD9NNNYHB",
};


const app =  initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage();
export const db = getFirestore()

// const db = firebase.firestore
// export {db}

