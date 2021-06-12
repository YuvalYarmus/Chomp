import firebase from "firebase/app";
import {User, Room, Chat, Message, Move} from "./types"

export default async function getRoomUsers(userId: string) {
  return new Promise<User>(async (resolve, reject) => {
    try {
      const user = (await firebase.firestore().collection(`users`).doc(`${userId}`).get()).data() as User;
      resolve(user);
    } catch (err) {
      console.log(`failed to add user to Room: ${err}`);
      reject(null);
    }
  });
}
