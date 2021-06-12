import firebase from "firebase/app";
import { User, Room, Chat, Message } from "./types";

const createGameString = (n: number, m: number): string => {
  let string = "";
  for (let i = 0; i < m; i++) {
    string += (n - 1).toString();
  }
  return string;
};

export async function writeToFireStore(room: Room, user: User) {
  try {
    user["created"] = firebase.firestore.Timestamp.now();
    await firebase.firestore().collection("users").doc(`${user.id}`).set(
      {
        id: user.id,
        name: user.name,
        room: user.room,
        created: firebase.firestore.Timestamp.now(),
      },
      { merge: true }
    );

    await firebase
      .firestore()
      .collection(`rooms`)
      .doc(`${room.uuid}`)
      .set(
        {
          population: 1,
          uuid: room.uuid,
          moves: [createGameString(room.n, room.m)],
          users: [user],
          n: room.n,
          m: room.m,
          currTurn: 0,
        },
        { merge: true }
      );
    const firstMessage: Message = {
      message: `chat for room ${room.uuid} created`,
      time: firebase.firestore.Timestamp.now(),
      sender: "Server",
    };
    await firebase
      .firestore()
      .collection(`rooms`)
      .doc(`${room.uuid}`)
      .collection(`chat`)
      .add({
        firstMessage,
      })
      .then(() => {
        console.log(`sent to firestorm successfully from write`);
        alert("sent to firestorm successfully from write");
      });
    return new Promise<void>((resolve) => {
      alert(`sent to firestorm successfully from resolve`);
      resolve();
    });
  } catch (e) {
    console.log(`got an error trying inserting a user to users :${e}`);
    alert(`sending failed`);
    setTimeout(() => {}, 3000);
    return new Promise((reject) => "did not work");
  }
}

// have a collection of rooms where each room is a document
// each room will have a user list, move list and a  - chat history which will be a subcollection -
// also have a collection of users
