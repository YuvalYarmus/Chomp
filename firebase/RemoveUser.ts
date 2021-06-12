import firebase from "firebase/app";
import firestore from "firebase/firestore";
import { Game } from "../Game";
import init from "../firebase/initFirebase";
import Firebase from "firebase";

export type User = {
  id: string;
  name: string;
  room: string;
  created?: any;
};

export default async function removeUser(user: User) {
  try {
    console.log(`trying to remove a user from users`);
    setTimeout(async () => {
      await firebase.firestore().collection("users").doc(`${user.id}`).delete();
    });
    return new Promise<void>((resolve) => {
      console.log(`removed a user from users (from resolve)`);
      resolve();
    });
  } catch (err) {
    console.log(`got an error trying to remove a user from users :${err}`);
    return new Promise<void>((reject) => reject());
  }
}
