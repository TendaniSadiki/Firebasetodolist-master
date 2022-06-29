import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getAuth} from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyAAJ6333vmI8C0mcz59ug7YF_dzJegH_xE",
  authDomain: "todolist-f4c26.firebaseapp.com",
  databaseURL: "https://todolist-f4c26-default-rtdb.firebaseio.com",
  projectId: "todolist-f4c26",
  storageBucket: "todolist-f4c26.appspot.com",
  messagingSenderId: "737210606992",
  appId: "1:737210606992:web:28551b21128a81e6a73f15"
  };
  
  
  const app = initializeApp(firebaseConfig);
export  const auth = getAuth(app);
export const db = getDatabase(app);
