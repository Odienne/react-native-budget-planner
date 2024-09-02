import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import {getAuth} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyD_uOiNgKSlFil66m_sbi1LBT5VLzNE1z4",
    authDomain: "budget-planner-app-78a23.firebaseapp.com",
    projectId: "budget-planner-app-78a23",
    storageBucket: "budget-planner-app-78a23.appspot.com",
    messagingSenderId: "390379566299",
    appId: "1:390379566299:web:3acadb42e89686905388fe"
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore()
export const storage = getStorage()
export const auth = getAuth()
