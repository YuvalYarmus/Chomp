import firebase from "firebase/app";
import init from "../firebase/initFirebase";
import {User, Room, Chat, Message} from "./types"

export default async function removeRoomUser(user: User) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      console.log(`trying to remove user: ${user.name} from room: ${user.room}`);
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${user.room}`)
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(user.id),
          population: firebase.firestore.FieldValue.increment(-1),
        }).then( () => {
          console.log(`managed to remove the user from the db`);
          resolve(true);
        }).catch( (e) => {
          console.log(`failed to remove the user from the db`);
          reject(e);
        });
      } catch (e) {
        console.log(`error in removing user from the db`);
        reject(e);
    }
  });
}
