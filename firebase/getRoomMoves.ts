import firebase from "firebase/app";
import firestore from "firebase/firestore";
import { Game } from "../Game";
import init from "../firebase/initFirebase";
import Firebase from "firebase";

export default async function getRoomMoves(uuid: string) {
  return new Promise<string[]>(async (resolve, reject) => {
    try {
      init();
      const room: any = (
        await firebase.firestore().collection(`rooms`).doc(`${uuid}`).get()
      ).data();
      const moves: string[] = room.moves;
      console.log(
        `\nIn addRoomUser - room is: ${JSON.stringify(
          room
        )} and moves is ${JSON.stringify(moves)}`
      );
      resolve(moves);
    } catch (err) {
      console.log(`failed to add user to Room: ${err}`);
      reject(err);
    }
  });

}
