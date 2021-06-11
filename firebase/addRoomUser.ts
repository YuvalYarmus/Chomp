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

export default async function addRoomUser(user: User) {
  try {
    init();
    const room : any = await (await firebase.firestore().collection(`rooms`).doc(`${user.room}`).get()).data();
    const users : [] = room.users
    console.log(`\nIn addRoomUser - room is: ${JSON.stringify(room)} and users is ${JSON.stringify(users)}`)
    const exists = users.some( (roomUser : User) => user.name === roomUser.name);
    if (exists) return new Promise<boolean>( (resolve) => {
        console.log(`a user with that name - ${user.name} already exists`);
        users.forEach((roomUser : User) => {
            if (user.name === roomUser.name) {
                return new Promise<string>( (resolve) => {
                    console.log(`a user with that name - ${roomUser.name} already exists`);
                    alert(`a user with that name - ${roomUser.name} already exists `)
                    resolve(roomUser.id);
                });
            }
        })
    });
    user["created"] = firebase.firestore.Timestamp.now();
    console.log(`user is now in addRoomUser as : ${JSON.stringify(user)}`);
    setTimeout(async () => {
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${user.room}`)
        .update({
          users: firebase.firestore.FieldValue.arrayUnion(user),
          population: firebase.firestore.FieldValue.increment(1),
        });
    });
    return new Promise<boolean>((resolve) => {
      console.log(`added user to Room (from resolve)`);
      resolve(true);
    });
  } catch (err) {
    console.log(`failed to add user to Room: ${err}`);
    return new Promise<boolean>((reject) => reject(false));
  }
}
