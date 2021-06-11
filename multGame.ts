import { Game, Circle } from "./Game";

import init from "./firebase/initFirebase"
import addRoomMove from "./firebase/addRoomMove"



/*
I reached the conclusion that the real time listening to the db should be in this multGame class
at first I thought I should determine if the user is a player in here than since there is already
the real time listening. However I decided that it would more simple to do it on the page side and pass
it to the canvas component as a param
*/
export default class MultGame extends Game {
    
    canPlay : boolean = false;
    room: string;
    userId: string;
    userIndex: number;
    constructor(
    userIndex: number,
    room : string,
    userId : string,
    canvas: HTMLCanvasElement | null = null,
    n: number = -1,
    m: number = -1, 
  ) {
    super(canvas, n , m);
    this.userIndex = userIndex;
    this.room = room;
    this.userId = userId;
    this.canPlay = this.userIndex === 1;
    init();
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

        if (this.userIndex != 0 && this.userIndex != 1) {
          alert(`You are not one of the 2 players. Please do not interupt the game.`)
          break;
        }
        else if (!this.canPlay) {
          alert(`Please wait for your turn.`)
          break;
        }
        i = circle.i;
        j = circle.j;
        if (circle.i === 0 && circle.j === 0) {
          this.canPlay = !this.canPlay;
          this.turns++;
          this.updateState(circle);
          this.updateMove();
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          console.log("THE GAME HAS ENDED");
          setTimeout(() => this.promptGameState.bind(this)() , 300);
        } else {
          this.canPlay = !this.canPlay;
          this.turns++;
          this.updateState(circle);
          this.updateMove();
          this.circles = this.fitShapes(this.canvas, this.globalGameState);
          this.drawShapes(this.circles);
        }
      }
    }
    return [j, i];
  }

  updateMove() {
    (async () => {
      try {
        const res = await addRoomMove(this.globalGameState, this.room);
        if (!res) {
          console.log(`updating move in db failed: ${res}`)
          throw new Error(`updating move in db failed custom error`);
        }
      } catch (e) {
        console.log(`error updating move in db: ${e}`);
      }
    }).bind(this)();
    
  }

  movesListener() {
    
  }


}
