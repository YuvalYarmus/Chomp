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
export type Room = {
  population: number;
  uuid: string;
  moves?: string[];
  users: User[];
  n: number;
  m: number;
  currTurn: number;
  chat?: Chat;
};

export type Chat = {
  messages: Message[];
};

export type Message = {
  message: string;
  time: string;
  sender: string;
};

export default async function removeRoomUser(user: User) {
  try {
    init();
    console.log(`trying to remove `)
    setTimeout(async () => {
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${user.room}`)
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(user.id),
          population: firebase.firestore.FieldValue.increment(-1),
        });
    });
    return new Promise<void>((resolve) => {
      console.log(`removed user from the Room (from resolve)`);
      resolve();
    });
  } catch (err) {
    console.log(`failed to remove user from the Room: ${err}`);
    return new Promise<void>((reject) => reject());
  }
}
