import firebase from "firebase/app";
import {User, Room, Chat, Message} from "./types"

export default async function getRoomUsers(uuid: string) {
  return new Promise<User[] | null>(async (resolve, reject) => {
    try {
      const room: any = (
        await firebase.firestore().collection(`rooms`).doc(`${uuid}`).get()
      ).data();
      const users: User[] = room.users;
      console.log(`\nIn getRoomUsers - room is: ${JSON.stringify(room)} and users is ${JSON.stringify(users)}`);
      resolve(users);
    } catch (err) {
      console.log(`failed to add user to Room: ${err}`);
      reject(null);
    }
  });
}
