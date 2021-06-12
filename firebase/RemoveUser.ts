import firebase from "firebase/app";
import { User } from "./types"

export default async function removeUser(user: User) {
  try {
    console.log(`trying to remove a user from users`);
    setTimeout(async () => {
      await firebase.firestore().collection("users").doc(`${user.id}`).delete();
    });
    return new Promise<void>((resolve) => {
      console.log(`removed a user from users (from resolve)`);
      resolve();
    });
  } catch (err) {
    console.log(`got an error trying to remove a user from users :${err}`);
    return new Promise<void>((reject) => reject());
  }
}
