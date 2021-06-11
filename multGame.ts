import { Game, Circle } from "./Game";
import addRoomMove from "./firebase/addRoomMove"
import {getRoomUsers, User} from "./firebase/getRoomUsers"
import getRoomMoves from "./firebase/getRoomMoves";
import init from "./firebase/initFirebase"



/*
I reached the conclusion that the real time listening to the db should be in this multGame class
at first I thought I should determine if the user is a player in here than since there is already
the real time listening. However I decided that it would more simple to do it on the page side and pass
it to the canvas component as a param
*/
export class MultGame extends Game {
    
    myTurn : number = 0;
    canPlay : boolean = false;
    room: string;
    userId: string;
    first2: boolean = false;
    constructor(
    first2: boolean,
    canvas: HTMLCanvasElement | null = null,
    n: number = -1,
    m: number = -1, 
    room : string,
    userId : string,
    myTurn = 0,
    canPlay = false,
  ) {
    super();
    this.myTurn = myTurn;
    this.canPlay = canPlay;
    this.room = room;
    this.userId = userId;
    this.first2 = first2;
    (async () => {
      this.first2 = await this.isFirst2();
    })();
  }

  /**
   * extending to add a check if the move is legal (based on the db update) 
   * if so it should update the database to the new state
   * also should add sound if a redrawing actually occur
   * @param e 
   * @returns 
   */
  moveClick(e: MouseEvent) {
    const CANVASpos = this.getMousePos(e);
    let i: number = -1;
    let j: number = -1;
    for (const circle of this.circles) {
      if (this.isIntersect(CANVASpos, circle) === true) {



        i = circle.i;
        j = circle.j;
        if (circle.i === 0 && circle.j === 0) {
          this.turns++;
          this.updateState(circle);
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          console.log("THE GAME HAS ENDED");
          setTimeout(() => this.promptGameState.bind(this)() , 300);
        } else {
          this.turns++;
          this.updateState(circle);
          this.circles = this.fitShapes(this.canvas, this.globalGameState);
          this.drawShapes(this.circles);
        }
      }
    }
    return [j, i];
  }

  /* isFirst2() : Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        init();
        const roomUsers = await getRoomUsers(this.room);
        if (roomUsers === null) {
          throw new Error(`there are no users in the room - checked within the game class`);
          reject(false);
        } 
        for(let i = 0; i < 2 && i < roomUsers!.length; i++) {
          if (roomUsers![i].id === this.userId) return true;
        }
        resolve(false);
      } catch (e) {
        console.log(`error trying to decide if the user is a player - ${e}`)
        reject();
      }

    });
  }
  */

  async isFirst2() : Promise<boolean> {
    // (async () => {
    //   init();
    //   const roomUsers = await getRoomUsers(this.room);
      // if (roomUsers === null) throw new Error(`there are no users in the room - checked within the game class`);
      // for(let i = 0; i < 2 && i < roomUsers!.length; i++) {
      //   if (roomUsers![i].id === this.userId) return true;
      // }
      // return false;
    // } )();

    // const roomUsers =  (async () => {
    //   return await getRoomUsers(this.room);
    // })();

    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const roomUsers = await getRoomUsers(this.room);
        if (roomUsers === null) throw new Error(`there are no users in the room - checked within the game class`);
        for(let i = 0; i < 2 && i < roomUsers!.length; i++) {
          if (roomUsers![i].id === this.userId) resolve(true);
        }
        resolve(false);
      } catch (err) {
        console.log(`had an error trying to determine if the user is a player: ${err}`)
        reject(err);
      }
    });
  }

  allowedToPlay() {

  }


}
