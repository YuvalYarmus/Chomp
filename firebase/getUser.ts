import firebase from "firebase/app";
import {User, Room, Chat, Message, Move} from "./types"

export default async function getRoomUsers(userId: string) {
  return new Promise<User>(async (resolve, reject) => {
    try {
      resolve((await firebase.firestore().collection(`users`).doc(`${userId}`).get()).data() as User);
    } catch (err) {
      console.log(`failed to add user to Room: ${err}`);
      reject(null);
    }
  });
}
