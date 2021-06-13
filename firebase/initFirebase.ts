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

  let envConfig: { apiKey: string; authDomain: string | undefined; projectId: string | undefined; storageBucket: string | undefined; messagingSenderId: string | undefined; appId: string | undefined; } | null = null;
  if (process.env.apiKey) {
      envConfig = {
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        projectId: process.env.projectId,
        storageBucket: process.env.storageBucket,
        messagingSenderId: process.env.messagingSenderId,
        appId: process.env.appId
      };
  }

export default function initFirebase() {
    console.log(`in firebase init function`)
    if (!firebase.apps.length) {
        if (envConfig != null) {
            console.log(`MAKING AN INIT WITH ENVIRONMENT VARIABLES`)
            firebase.initializeApp(envConfig);
        }
        else firebase.initializeApp(firebaseConfig);
        console.log(`Firebase was successfully init. envConfig: ${envConfig}`);
    }
}


// authenticate the first user on the loading page
//
// have a collection of rooms where each room is a document
// each room will have a user list, move list and a  - chat history which will be a subcollection -
// also have a collection of users