import firebase from "firebase/app";
import init from "../firebase/initFirebase";

export default async function addRoomMove(move: string, uuid: string, player : string) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      init();
      const moveId = move = ""? "game over" : move;
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${uuid}`)
        .collection(`moves`)
        .doc(`${moveId}`)        
        .set({
          move: move,
          by: player,
          time: firebase.firestore.Timestamp.now(),
        }, {merge: true});
      resolve(true);
    } catch (err) {
      console.log(`failed to move to users in room: ${err}`);
      reject(false);
    }
  });
}
// export default async function addRoomMove(move: string, uuid: string) {
//   return new Promise<boolean>(async (resolve, reject) => {
//     try {
//       init();
//       setTimeout(async () => {
//         await firebase
//           .firestore()
//           .collection(`rooms`)
//           .doc(`${uuid}`)
//           .update({
//             moves: firebase.firestore.FieldValue.arrayUnion(move),
//           });
//       });
//       resolve(true);
//     } catch (err) {
//         console.log(`failed to move to users in room: ${err}`);
//         reject(false);
//     }
//   });

// }
