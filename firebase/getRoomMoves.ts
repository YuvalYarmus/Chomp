import firebase from "firebase/app";
import init from "../firebase/initFirebase";
import {User, Room, Chat, Message , Move} from "./types"


export async function getRoomMoves(uuid: string) {
  return new Promise<any[]>(async (resolve, reject) => {
    try {
      init();
      let moves: Move[] = [];
      await firebase
      .firestore()
      .collection(`rooms`)
      .doc(`${uuid}`)
      .collection(`moves`)
      .orderBy("time", "desc")
      .get().then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
          let move = doc.data() as Move;
          move.time = JSON.parse(move.time.toDate());
          moves.push(move)
          console.log(`in getRoomMoves with move: ${JSON.stringify(move)}`)
        });
      }).catch( (err) => {
        console.log(`error in getRoomMoves: ${err}`);
        reject(err);
      });
      resolve(moves);
    } catch (err) {
      console.log(`failure / error in getRoomMoves: ${err}`);
      reject(err);
    }
  });

}

// export default async function getRoomMoves(uuid: string) {
//   return new Promise<string[]>(async (resolve, reject) => {
//     try {
//       init();
//       const room: any = (
//         await firebase.firestore().collection(`rooms`).doc(`${uuid}`).get()
//       ).data();
//       const moves: string[] = room.moves;
//       console.log(
//         `\nIn addRoomUser - room is: ${JSON.stringify(
//           room
//         )} and moves is ${JSON.stringify(moves)}`
//       );
//       resolve(moves);
//     } catch (err) {
//       console.log(`failed to add user to Room: ${err}`);
//       reject(err);
//     }
//   });

// }
