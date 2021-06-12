import firebase from "firebase/app";
import {User, Room, Chat, Message} from "./types"
import getRoomUsers from "./getRoomUsers";

export default async function removeRoomUser(user: User) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      console.log(`trying to remove user: ${user.name} from room: ${user.room}`);
      const roomUser = (await getRoomUsers(user.room) as User[]).filter(roomUser => roomUser.id == user.id)[0];
      console.log(`roomUser: `)
      console.table(roomUser);
      // arrayRemove only works if all the map (the object in the array) are exactly the same
      // the timestamp will be a bit different between the user in the users collection and the one in
      // the room due to the lag. therefore we just find it directly in the room's users list
      await firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${user.room}`)
        .update({
          'users' : firebase.firestore.FieldValue.arrayRemove(roomUser),  
          'population': firebase.firestore.FieldValue.increment(-1),
        }).then( () => {
          console.log(`managed to remove the user from the db`);  
          resolve(true);
        }).catch( (e) => {
          console.log(`failed to remove the user from the db`);  
          resolve(e);
        });

      } catch (e) {
        console.log(`error in removing user from the db`);
        reject(e);
    }
  });
}
