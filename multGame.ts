import { Game, Circle } from "./Game";
import addRoomMove from "./firebase/addRoomMove"
import getRoomUsers from "./firebase/getRoomUsers"
import getRoomMoves from "./firebase/getRoomMoves";
import init from "./firebase/initFirebase"

export class MultGame extends Game {
    
    myTurn : number = 0;
    canPlay : boolean = false;
    room: string;
    userId: string;

    constructor(
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

  async isFirst2() {
    init();
    const roomUsers = await getRoomUsers(this.room);
    if (roomUsers === null) return false;
    if (roomUsers!.length < 2) return false;
    for(let i = 0; i < 2 && i < roomUsers!.length; i++) {
      if (roomUsers![i].id === this.userId) return true;
    }
    return false;
  }


}
