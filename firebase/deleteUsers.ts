import firebase from "firebase/app";
import {User, Room, Chat, Message, Move} from "./types"
// import firestore from "firebase/firestore";
// let batch = firestore.batch();

export default async function deleteUsers() {

  return new Promise<boolean>(async (resolve, reject) => {
    try {
		// get all docs in users
		await firebase.firestore().collection("users").get()
		.then( querySnapShot => {
			// run on all docs
			querySnapShot.docs.forEach( (doc) => {
				if (doc.data().created - 1000 * 30 <= 0) {
					console.log("should delete");
					doc.ref.delete();
				}
				else console.log("should not delete");
			});
		}).catch((err) => {
			console.log(`failed to remove a user from users`);
			resolve(false);
		});
    } catch (err) {
      console.log(`got an error removing a user to users :${err}`);
      reject(err);
    }
  });

}