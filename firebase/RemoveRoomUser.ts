import firebase from "firebase/app";
import init from "../firebase/initFirebase";
import {User, Room, Chat, Message} from "./types"

export default async function removeRoomUser(user: User) {
  try {
    init();
    console.log(`trying to remove `)
    setTimeout(async () => {
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${user.room}`)
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(user.id),
          population: firebase.firestore.FieldValue.increment(-1),
        });
    });
    return new Promise<void>((resolve) => {
      console.log(`removed user from the Room (from resolve)`);
      resolve();
    });
  } catch (err) {
    console.log(`failed to remove user from the Room: ${err}`);
    return new Promise<void>((reject) => reject());
  }
}
