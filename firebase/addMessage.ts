import firebase from "firebase/app";
import firestore from "firebase/firestore";
import { Game } from "../Game";
import init from "../firebase/initFirebase";
import Firebase from "firebase";

export type Message = {
  message: string;
  time: any;
  sender: string;
};

export async function addMessage(message: string, sender: string, uuid: string) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      if (message === "") resolve(false);
      else { 
        init();
        const messageObj : Message = {
            message: message,
            sender: sender,
            time : firebase.firestore.FieldValue.serverTimestamp(),
        }
        await firebase
          .firestore()
          .collection(`rooms`)
          .doc(`${uuid}`)
          .collection(`chat`)
          .doc().set({
            message: message,
            sender: sender,
            time : firebase.firestore.FieldValue.serverTimestamp(),
          });
        resolve(true);
      }
    } catch (err) {
      console.log(`failed to move to users in room: ${err}`);
      reject(false);
    }
  });
}
