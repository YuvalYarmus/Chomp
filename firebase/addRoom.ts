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

type Chat = {
  messages: Message[];
};

type Message = {
  message: string;
  time: string;
  sender: string;
};

export const createGameString = (n: number, m: number): string => {
  let string = "";
  for (let i = 0; i < m; i++) {
    string += (n - 1).toString();
  }
  return string;
};

export default async function addRoomToFirestore(room: Room) {
  try {
    await firebase
      .firestore()
      .collection(`rooms`)
      .doc(`${room.uuid}`)
      .set(
        {
          population: 0,
          uuid: room.uuid,
          moves: [createGameString(room.n, room.m)],
          users: [],
          n: room.n,
          m: room.m,
          currTurn: 0,
        },
        { merge: true }
      );
    await firebase
      .firestore()
      .collection(`rooms`)
      .doc(`${room.uuid}`)
      .collection(`chat`)
      .add({
        messages: [],
      })
      .then(() => {
        console.log(`sent to firestorm successfully from write`);
        alert("sent to firestorm successfully from write");
      });
    return new Promise<void>((resolve) => {
      alert(`added a room to firestorm successfully (from resolve)`);
      resolve();
    });
  } catch (err) {
      console.log(`got an error in creating a room: ${err}`)
      return new Promise<void>((reject) => reject());
  }
}
