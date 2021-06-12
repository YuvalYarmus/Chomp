import firebase from "firebase/app";
import { User } from "./types"

export default async function removeUser(user: User) {

  return new Promise<boolean>(async (resolve, reject) => {
    try {
      console.log(`trying to remove a user from users`);
      await firebase.firestore().collection("users").doc(`${user.id}`).delete().then(() => {
        console.log(`managed to delete the user from users`);
        resolve(true);
      }).catch((e) => {
        console.log(`failed to remove user from users`);
        resolve(false);
      });
    } catch (e) {
      console.log(`got an error trying to remove a user from users :${e}`);
      return new Promise<void>((reject) => reject());
    }
  });

}
