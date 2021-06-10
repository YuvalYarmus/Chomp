import firebase from "firebase/app";
import firestore from "firebase/firestore";
import { Game } from "../Game";
import init from '../firebase/initFirebase'
import Firebase from 'firebase'

export type User = {
  id: string;
  name: string;
  room: string;
  created? : any;
};

export default async function addUserToFireStore(user : User) {
    try {
        user['created'] = firebase.firestore.Timestamp.now();
        await firebase.firestore().collection("users").doc(`${user.id}`).set(
          {
            id: user.id,
            name: user.name,
            room: user.room,
            created: firebase.firestore.Timestamp.now() 
          },
          { merge: true }
        );
        return new Promise<void>((resolve) => {
            console.log(`added a user to users (from resolve)`);
            resolve();
        });
    } catch (err) {
        console.log(`got an error trying inserting a user to users :${err}`);
        return new Promise(reject => 'did not work');
    }


}