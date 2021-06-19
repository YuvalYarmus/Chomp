import firebase from "firebase/app";
import { User } from "./types"

// export type User = {
//   id: string;
//   name: string;
//   room: string;
//   created? : any;
// };

export default async function addUserToFireStore(user: User) {
  try {
    user["created"] = firebase.firestore.Timestamp.now();
    console.log(`user is now in addUser as : ${JSON.stringify(user)}`);
    await firebase
      .firestore()
      .collection("users")
      .doc(`${user.id}`)
      .set(
        {
          id: user.id,
          name: user.name,
          room: user.room,
          created: firebase.firestore.Timestamp.now(),
        },
        { merge: true }
      )
      .then((doc) => {
        console.log(`added user to users: ${doc}`);
      })
      .catch((err) => {
        console.log(`error in adding user to users: ${err}`);
      });
    await firebase
      .firestore()
      .collection(`rooms`)
      .doc(`${user.room}`)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(user),
        population: firebase.firestore.FieldValue.increment(1),
      });
    // return new Promise<void>( resolve  => {
    //   resolve();
    // } );
  } catch (e) {
    console.log(`got an error trying inserting a user to users :${e}`);
    return new Promise((reject) => "did not work");
  }
}

// have a collection of rooms where each room is a document
// each room will have a user list, move list and a  - chat history which will be a subcollection -
// also have a collection of users
