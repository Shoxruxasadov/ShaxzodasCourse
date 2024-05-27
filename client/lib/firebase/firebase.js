import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBTxrPRY60B4eCQEhQX5FqFr5Aryihkz4",
    authDomain: "shaxzodasonlinecourse.firebaseapp.com",
    projectId: "shaxzodasonlinecourse",
    storageBucket: "shaxzodasonlinecourse.appspot.com",
    messagingSenderId: "277380057485",
    appId: "1:277380057485:web:e48ee4bb58c7ee0c9095c4"
  };

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const storage = getStorage(app);
export default app;