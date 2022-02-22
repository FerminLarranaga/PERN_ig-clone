import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCLnCkzSnQwc2Du8sQt9qz83jzL84ui2Mk",
    authDomain: "instagramm--clone.firebaseapp.com",
    projectId: "instagramm--clone",
    storageBucket: "instagramm--clone.appspot.com",
    messagingSenderId: "784155355097",
    appId: "1:784155355097:web:524ac4380c1d1246c11bc8",
    measurementId: "G-DYH75MVMMB"
});

const storage = getStorage(firebaseApp);

export { storage }