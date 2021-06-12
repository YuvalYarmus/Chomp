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

export default async function addUserToUsers(user : User) {

  return new Promise<boolean>(async (resolve, reject) => {
    try {
      user['created'] = firebase.firestore.Timestamp.now();
        console.log(`user is now in addUserToUsers as : ${JSON.stringify(user)}`);
        setTimeout(async () => {
            await firebase.firestore().collection("users").doc(`${user.id}`).set(
              {
                id: user.id,
                name: user.name,
                room: user.room,
                created: firebase.firestore.Timestamp.now() 
              },
              { merge: true }
            );
        });
      console.log(`added a user to users (from resolve)`);
      resolve(true);
    } catch (err) {
      console.log(`got an error trying inserting a user to users :${err}`);
      reject(false);
    }
  });

}