import firebase from "firebase/app";
import init from "../firebase/initFirebase";
import {User, Room, Chat, Message, Move} from "./types"

export async function addMessage(message: string, sender: string, uuid: string) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      if (message === "") resolve(false);
      else { 
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
