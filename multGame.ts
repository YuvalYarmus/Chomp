import { Game, Circle } from "./Game";

import init from "./firebase/initFirebase"



/*
I reached the conclusion that the real time listening to the db should be in this multGame class
at first I thought I should determine if the user is a player in here than since there is already
the real time listening. However I decided that it would more simple to do it on the page side and pass
it to the canvas component as a param
*/
export default class MultGame extends Game {
    
    myTurn : number = 0;
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
    myTurn = 0,
  ) {
    super(canvas, n , m);
    this.userIndex = userIndex;
    this.room = room;
    this.myTurn = myTurn;
    this.userId = userId;
    this.canPlay = this.userIndex === 2;
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

  


}
