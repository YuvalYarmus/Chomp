import * as functions from "firebase-functions";

exports.clearRoom = functions.firestore
  .document("rooms/{roomId}")
  .onUpdate(
    (snapshot, _) => {
      try {
        const room = snapshot.after.ref;
        const roomData = snapshot.after.data();
        const usersAfter: any[] | undefined = roomData.users;;

        if ((!usersAfter || usersAfter.length === 0) && !roomData.isNew) {
          room.delete();
        }
      } catch (e) {
        console.log("failed to clear room:");
        console.log(e);
      }
      return null;
    }
  );
