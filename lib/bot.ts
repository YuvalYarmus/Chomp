import { Game, Circle } from "./Game";

export class Bot extends Game {
  constructor(
    canvas: HTMLCanvasElement | null = null,
    n: number = -1,
    m: number = -1
  ) {
    super();
  }

  movesInOne(gameString: string): string[] | null {
    if (gameString === null || gameString === undefined) return null;
    else if (gameString === "0") return [""];
    let moves: string[] = [];
    for (let j = 0; j < gameString.length; j++)
      for (let i = 0; i < parseInt(gameString[j]) + 1; i++)
        moves.push(this.memoizedComp(gameString, i, j));
    return moves;
  }

  isSquare(gameString: string): boolean {
    if (gameString === (null || undefined || "0")) return false;
    let height = gameString[0];
    for (let j = 0; j < gameString.length; j++)
      if (gameString[j] != height) return false;
    return parseInt(height) + 1 === gameString.length;
  }

  memoizeComp(func: Function): Function {
    let cache: { [key: string]: string } = {};
    const memoized = (gameString: string, i: number, j: number) => {
      let key: string = gameString + `[${i}][${j}]`;
      if (cache[key] != (undefined && null)) return cache[key];
      let result = func(gameString, i, j);
      cache[key] = result;
      return result;
    };
    return memoized;
  }

  memoizeAlphaSquare(func: Function): Function {
    let cache: { [key: string]: boolean } = {};
    const memoized = (gameString: string) => {
      if (cache[gameString] != undefined && cache[gameString] != null)
        return cache[gameString];
      let bindFunc = func.bind(this);
      let res = bindFunc(gameString);
      cache[gameString] = res;
      return res;
    };
    return memoized;
  }

  memoizedComp = this.memoizeComp(this.computeState).bind(this);
  memoizedAlpha = this.memoizeAlphaSquare(this.alphabeta).bind(this);
  memoizedSquare = this.memoizeAlphaSquare(this.isSquare).bind(this);

  win(gameString: string): string | undefined {
    console.log(`\ngameString from win is: ${gameString}`);
    if (gameString === null || gameString === undefined) return undefined;
    else if (gameString === "0") {
      alert("Well played! You won!");
      return "";
    } else if (this.memoizedSquare(gameString))
      return this.computeState(gameString, 1, 1);
    let moves: string[] = this.movesInOne(gameString)!;
    if (typeof moves != "object")
      throw new Error(`moves is not an array: ${moves}`);
    for (let move of moves!) {
      let has_a_win = this.memoizedAlpha(move);
      if (has_a_win === undefined)
        throw new Error("has a win is undefined, move is " + move);
      if (!has_a_win) return move;
    }
    // if we can not win for in any of this positions, we will just a pick a random one
    // should be the larget one
    return moves[moves?.length - 1];
  }
  alphabeta(gameString: string): boolean | undefined {
    if (gameString === null || gameString === undefined) return undefined;
    else if (gameString === "") return true;
    if (typeof gameString != "string")
      console.log(`gameString isnt string: ${gameString}`);
    if (this.memoizedSquare(gameString)) return true;
    let moves = this.movesInOne(gameString);
    for (let move of moves!) {
      if (!this.memoizedAlpha(move)) return true;
    }
    return false;
  }

  updateGameString(i: number, j: number) {
    console.log(`updateGameString with: ${i}, ${j}`);
    this.globalGameState = this.computeState(this.globalGameState, i, j);
  }

  updateShapesByString() {
    for (const circle of this.circles) {
      if (parseInt(this.globalGameState[circle.j]) <= circle.i)
        circle.shouldDraw = true;
      else circle.shouldDraw = false;
    }
  }

  moveClick(e : MouseEvent) {
    console.log(`click click click`);
    console.log(`gameString is: ${this.globalGameState}`);
    console.log(`circles is: ${this.circles}`);

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
          setTimeout(() => this.promptGameState.bind(this)(), 300);
        } else {
          this.turns++;
          this.updateState(circle);
          this.circles = this.fitShapes(this.canvas, this.globalGameState);
          this.drawShapes(this.circles);
          // trigger sound
          setTimeout(() => {              
              let winString: string | undefined = this.win(this.globalGameState);
              if (winString === undefined) throw new Error("winsTRING is undefined: " + winString);
              this.globalGameState = winString;
              this.circles = this.fitShapes(this.canvas, this.globalGameState);
              this.drawShapes(this.circles);
              // trigger sound
          }, 300);
        }
      }
    }
    return [j, i];
  }
}

