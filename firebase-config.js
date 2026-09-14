// voting/firebase-config.js - YOUR CLOUD CONFIG - READY
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtT-iGXJkCmfeDjOHu20ddyI20c_ZkU6s",
  authDomain: "ballot-da7cb.firebaseapp.com",
  databaseURL: "https://ballot-da7cb-default-rtdb.firebaseio.com",
  projectId: "ballot-da7cb",
  storageBucket: "ballot-da7cb.firebasestorage.app",
  messagingSenderId: "1001019026503",
  appId: "1:1001019026503:web:2ca1093f66a87f55645562",
  measurementId: "G-ZTQ1SCVN2H"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, get, update, push, onValue, remove };