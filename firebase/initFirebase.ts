import firebase from 'firebase/app'
// the below imports are option - comment out what you don't need
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCt39LFoPbOpK8-IbrqutUhKEP1bH7MC9k",
    authDomain: "chomp-9a0f3.firebaseapp.com",
    projectId: "chomp-9a0f3",
    storageBucket: "chomp-9a0f3.appspot.com",
    messagingSenderId: "785308785684",
    appId: "1:785308785684:web:b8f96fd8de1619db865b01"
  };


export default function initFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
        console.log('Firebase was successfully init.')
    }
}


// authenticate the first user on the loading page
//
// have a collection of rooms where each room is a document
// each room will have a user list, move list and a  - chat history which will be a subcollection -
// also have a collection of users