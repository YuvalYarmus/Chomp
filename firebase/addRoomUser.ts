import firebase from "firebase/app";
import { User, Room, Chat, Message, Move } from "./types";

export default async function addRoomUser(user: User) {
  return new Promise<string | boolean | User>(async (resolve, reject) => {
    try {
      const room: any = (
        await firebase.firestore().collection(`rooms`).doc(`${user.room}`).get()
      ).data();
      const users: [] = room.users;

      console.table([room, users]);
      const existsId = users.some((roomUser: User) => user.id === roomUser.id);
      const existName = users.some(
        (roomUser: User) => roomUser.name === roomUser.name
      );
      if (existsId) {
        users.forEach((roomUser: User) => {
          if (user.name === roomUser.name) {
            console.log(
              `a user with that account - ${roomUser.name} already exists`
            );
            alert(
              `a user with that account - ${roomUser.name} already exists `
            );
            resolve(roomUser.id);
          }
        });
      } else if (!existsId && existName) {
        user["created"] = firebase.firestore.Timestamp.now();
        let howMany = 0;
        users.forEach((roomUser: User) => {
          if (roomUser.name === user.name) howMany += 1;
        });
        user.name = `${user.name}(${howMany})`;
        console.log(`user with updated name is: ${JSON.stringify(user)}`);
        await firebase
          .firestore()
          .collection(`rooms`)
          .doc(`${user.room}`)
          .update({
            users: firebase.firestore.FieldValue.arrayUnion(user),
            population: firebase.firestore.FieldValue.increment(1),
          });
        resolve(user);
      } else {
        user["created"] = firebase.firestore.Timestamp.now();
        console.log(`user is now in addRoomUser as : ${JSON.stringify(user)}`);
        await firebase
          .firestore()
          .collection(`rooms`)
          .doc(`${user.room}`)
          .update({
            isNew: false,
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
