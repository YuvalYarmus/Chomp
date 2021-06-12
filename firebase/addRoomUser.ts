import firebase from "firebase/app";
import init from "../firebase/initFirebase";
import {User, Room, Chat, Message, Move} from "./types"

export default async function addRoomUser(user: User) {
  return new Promise<string | boolean>(async (resolve, reject) => {
    try {
      init();
      const room: any = (await firebase.firestore().collection(`rooms`).doc(`${user.room}`).get()).data();
      const users: [] = room.users;
      console.table([room, users]);
      const exists = users.some((roomUser: User) => user.name === roomUser.name);
      if (exists) {
        users.forEach((roomUser: User) => {
          if (user.name === roomUser.name) {
            console.log(`a user with that name - ${roomUser.name} already exists`);
            alert(`a user with that name - ${roomUser.name} already exists `);
            resolve(roomUser.id);
          }
        });
      } else {
        user["created"] = firebase.firestore.Timestamp.now();
        console.log(`user is now in addRoomUser as : ${JSON.stringify(user)}`);
        await firebase
          .firestore()
          .collection(`rooms`)
          .doc(`${user.room}`)
          .update({
            users: firebase.firestore.FieldValue.arrayUnion(user),
            population: firebase.firestore.FieldValue.increment(1),
          });
        console.log(`added user to Room (from resolve)`);
        resolve(true);
      }
    } catch (err) {
      console.log(`failed to add user to Room: ${err}`);
      reject(false);
    }
  });
}
