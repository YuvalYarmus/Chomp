import * as functions from "firebase-functions";
import type { Change, EventContext } from "firebase-functions";
import type { QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";

exports.clearRoom = functions.firestore
  .document("rooms/{roomId}")
  .onUpdate(
    (snapshot: Change<QueryDocumentSnapshot>, context: EventContext) => {
      // Get an object representing the document prior to deletion
      // e.g. {'name': 'Marie', 'age': 66}
      // perform desired operations ...
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
