import firebase from "firebase/app";
import firestore from "firebase/firestore";
import { Game } from "../Game";
import init from "../firebase/initFirebase";

export type User = {
  id: string;
  name: string;
  room: string;
};

export default async function addUserToFireStore(user: User) {
  try {
    await firebase.firestore().collection("users").doc(`${user.id}`).set(
      {
        id: user.id,
        name: user.name,
        room: user.room,
      },
      { merge: true }
    );

    await firebase
      .firestore()
      .collection(`rooms`)
      .doc(`${user.room}`)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(user),
        population: firebase.firestore.FieldValue.increment(1),
      });
      return new Promise<void>( resolve  => {
        resolve();
      } );
    } catch (e) {
    console.log(`got an error trying inserting a user to users :${e}`);
    return new Promise((reject) => "did not work");
  }
}

// have a collection of rooms where each room is a document
// each room will have a user list, move list and a  - chat history which will be a subcollection -
// also have a collection of users
