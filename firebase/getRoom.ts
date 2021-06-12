import firebase from "firebase/app";
import {User, Room, Chat, Message, Move} from "./types"

export default async function getRoomUsers(uuid: string) {
  return new Promise<Room>(async (resolve, reject) => {
    try {
      const room = (await firebase.firestore().collection(`rooms`).doc(`${uuid}`).get()).data() as Room;
      resolve(room);
    } catch (err) {
      console.log(`failed to add user to Room: ${err}`);
      reject(null);
    }
  });
}
