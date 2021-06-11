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


export default async function getRoomUsers(uuid: string) {
  try {
    init();
    const room : any = (await firebase.firestore().collection(`rooms`).doc(`${uuid}`).get()).data();
    const users : User[] = room.users
    console.log(`\nIn getRoomUsers - room is: ${JSON.stringify(room)} and users is ${JSON.stringify(users)}`)
    return new Promise<User[]>((resolve) => {
      console.log(`added user to Room (from resolve)`);
      resolve(users);
    });
  } catch (err) {
    console.log(`failed to add user to Room: ${err}`);
    return new Promise<null>((reject) => reject(null));
  }
}
