import * as functions from "firebase-functions";
import { Change, EventContext } from "firebase-functions";
import {
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from "firebase-functions/lib/providers/firestore";
import { Room } from "../../firebase/types";
import deleteUsers from "../../firebase/deleteUsers";
import firebase from "firebase/app";
import { DataSnapshot } from "firebase-functions/lib/providers/database";

// import { DataSnapshot } from "firebase-functions/lib/providers/database";
// import { Context } from "react";
// import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//   .onUpdate((snapshot: QueryDocumentSnapshot, context: EventContext) => {
// .onWrite((snapshot: QueryDocumentSnapshot, context: EventContext`) => {

// (snapshot: Change<QueryDocumentSnapshot>, context: EventContext)

// exports.deleteDBRooms = functions.firestore
//   .document("rooms/{roomId}")
//   .onUpdate((snapshot: Change<QueryDocumentSnapshot>, context: EventContext) => {
// 	functions.logger.log("snapshot is:");
// 	functions.logger.log(snapshot);
// 	console.log(snapshot);
// 	// const change = snapshot.docChanges();
// 	// const data = change.doc.data();
// 	// console.log("data is:")
// 	// console.table(data);

// 	// const ref = snapshot.ref;
//     // const data = snapshot.data();
//     // console.log("data in cloud functions is:");
//     // console.log(data);
//     // functions.logger.log("data in cloud functions is:");
//     // functions.logger.log(data);
//     // after 30 seconds
//     // if (data.created - 1000 * 30 <= 0) ref.delete();
//   });
// exports.deleteDBUsers = functions.firestore
//   .document("users/{userId}")
//   .onCreate((snapshot: QueryDocumentSnapshot, context: EventContext) => {
//     const original = snapshot.data().original;
//     functions.logger.log("Uppercasing", context.params.documentId, original);
//     const uppercase = original.toUpperCase();
//     return snapshot.ref.set({ uppercase }, { merge: true });
//   });

// exports.deleteOldUsers = functions.database
//   .ref("users/{userId}")
//   .onWrite((change : Change<DataSnapshot>, context : EventContext) => {
//     var ref = change.after.ref.parent; // reference to the items
//     var now = Date.now();
//     // cutoff is 1 minute
//     var cutoff = now - 1 * 60 * 1000;
//     var oldItemsQuery = ref!.orderByChild("timestamp").endAt(cutoff);
//     return oldItemsQuery.once("value", function (snapshot) {
//       // create a map with all children that need to be removed
//       var updates: { [key: string]: any } = {};
//       snapshot.forEach((child) => {
//         updates[child.key!] = null;
//       });
//       // execute all updates in one go and return the result to end the function
//       return ref!.update(updates);
//     });
//   });

// exports.scheduledFunction = functions.pubsub
//   //   .schedule("every 2 minutes")
//   .schedule("every 30 seconds")
//   .onRun(async (context) => {
//     console.log("This will be run every 2 minutes!");
//     functions.logger.log("this is running every 2 minutes");

//     // firebase script to delete all users
//     // await deleteUsers();

//     return new Promise(async (resolve, reject) => {
//       try {
//         // get all docs in users
//         await firebase
//           .firestore()
//           .collection("users")
//           .get()
//           .then((querySnapShot) => {
//             // run on all docs
//             querySnapShot.docs.forEach((doc) => {
//               if (doc.data().created - 1000 * 30 <= 0) {
//                 console.log("should delete");
//                 doc.ref.delete();
//               } else console.log("should not delete");
//             });
//           })
//           .catch((err) => {
//             console.log(`failed to remove a user from users`);
//             resolve(false);
//           });
//         resolve(true);
//       } catch (err) {
//         console.log(`got an error removing a user to users :${err}`);
//         reject(err);
//       }
//     });
//     return null;
//   });

exports.clearRoom = functions.firestore
  .document("rooms/{roomId}")
  .onUpdate((snapshot: Change<QueryDocumentSnapshot>, context: EventContext) => {
    // Get an object representing the document prior to deletion
    // e.g. {'name': 'Marie', 'age': 66}
	// perform desired operations ...
    const room = snapshot.after.ref	;
	const usersAfter = context.params.users;
	if (usersAfter === null || usersAfter.length === 0) {
		room.delete();
	}
	return null;
  });
