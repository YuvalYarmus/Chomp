import firebase from "firebase/app";
import firestore from "firebase/firestore";
import { Game } from "../Game";
import init from "../firebase/initFirebase";
import Firebase from "firebase";

export default async function addRoomMove(move: string, uuid: string) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      init();
      setTimeout(async () => {
        await firebase
          .firestore()
          .collection(`rooms`)
          .doc(`${uuid}`)
          .update({
            moves: firebase.firestore.FieldValue.arrayUnion(move),
          });
      });
      resolve(true);
    } catch (err) {
        console.log(`failed to move to users in room: ${err}`);
        reject(false);
    }
  });

}
