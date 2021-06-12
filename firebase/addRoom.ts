import firebase from "firebase/app";
import {User, Room, Chat, Message, Move} from "./types"

export const createGameString = (n: number, m: number): string => {
  let string = "";
  for (let i = 0; i < m; i++) {
    string += (n - 1).toString();
  }
  return string;
};

export default async function addRoomToFirestore(room: Room) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${room.uuid}`)
        .set(
          {
            population: 0,
            uuid: room.uuid,
            // moves: [createGameString(room.n, room.m)],
            users: [],
            n: room.n,
            m: room.m,
            currTurn: 0,
          },
          { merge: true }
        );
        const firstState = createGameString(room.n, room.m);
        await firebase
        .firestore().
        collection(`rooms`)
        .doc(`${room.uuid}`)
        .collection(`moves`)
        .doc(`${firstState}`).set({
          move: firstState,
          by: `Initial from server`,
          time: firebase.firestore.Timestamp.now(),
        }, {merge: true})
        const firstMessage : Message = {
          message: `chat for room ${room.uuid} created`,
          time: firebase.firestore.Timestamp.now(),
          sender : 'Server'
        } 
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${room.uuid}`)
        .collection(`chat`)
        .add(firstMessage)
        .then(() => {
          console.log(`sent to firestorm successfully from addRoom`);
          alert("sent to firestorm successfully from addRoom");
        });
      resolve(true);
    } catch (err) {
      console.log(`got an error in creating a room: ${err}`);
      reject(false);
    }
  });

}
