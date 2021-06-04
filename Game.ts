interface point {
  x: number;
  y: number;
}
export interface Circle {
  id: string;
  x: number;
  y: number;
  r: number;
  i: number;
  j: number;
  shouldDraw: boolean;
}
export class Circle implements Circle {
  id: string;
  x: number;
  y: number;
  r: number;
  i: number;
  j: number;
  shouldDraw: boolean;

  constructor(
    x: number,
    y: number,
    radius: number,
    i: number,
    j: number,
    shouldDraw = true
  ) {
    this.id = `${j}-${i}`;
    this.x = x;
    this.y = y;
    this.r = radius;
    this.i = i;
    this.j = j;
    this.shouldDraw = shouldDraw;
  }

  toString() {
    // return `draw is ${this.shouldDraw}, i is ${this.i}, j is ${this.j}`;
    return `\n[${this.id}][r:${this.r}][x:${this.x}][y:${this.y}]-${this.shouldDraw}\n`;
  }
}

// mimicking a boolean 2d array which will represent the game state
type boolState = boolean[][];

export class Game {
  n: number = -1;
  m: number = -1;
  globalGameState: string = "";
  circles: Circle[] = [];
  color: string;
  turns = 0;
  dpr = 1;
  //   canvas : HTMLCanvasElement;
  //   ctx: CanvasRenderingContext2D;
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  ctx = this.canvas.getContext("2d")!;

  constructor(canvas: HTMLCanvasElement | null = null, n: number = -1, m: number = -1) {
    // this.canvas = canvas;
    // this.ctx =  canvas.getContext("2d");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      //document.documentElement.classList.add('dark')
      this.color = "#dbdbdb";
    } else this.color = "black";

    window.addEventListener("resize", () => {
      this.resize2.bind(this)();
      console.log(`width: ${this.canvas.width} height: ${this.canvas.height}`)
    })

    // this.canvas.addEventListener("mousedown" , (MouseEvent) => {
    //   const {x, y} = MouseEvent;
    //   let ij : number[] = this.moveClick2(x, y);
    //   console.log(`i and j of the circle click: ${ij}`);
    // })

    this.canvas.addEventListener("click", (e) => {
      
      let ij : number[] = this.moveClick(e);
      console.log(`i and j of the circle click: ${ij}`)
    });

    if (n === -1 || m === -1) this.promptGameState();
    else {
      this.n = n;
      this.m = m;
      this.globalGameState = this.createGameString(n, m);
      this.circles = this.fitShapes(this.canvas, this.globalGameState);
      this.drawShapes(this.circles);
    }
  }


  resize2 = () => {
    // look up the size the canvas is being displayed
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.ctx = this.canvas.getContext("2d", { alpha: false })!;
    this.ctx.scale(this.dpr, this.dpr);

    // If it's resolution does not match change it
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width * this.dpr;
      this.canvas.height = height * this.dpr;

      this.circles = this.fitShapes(this.canvas, this.globalGameState);
      this.drawShapes(this.circles);
      return true;
    }

    return false;
  };

  resizeFunc() {
    // this.canvas.height = Math.round(window.innerHeight * 0.9);
    // this.canvas.height -= this.canvas.height % 2;
    // this.canvas.width = Math.round(window.innerWidth * 0.9);
    // this.canvas.width -= this.canvas.width % 2;
    this.ctx.scale(3,3);
    this.canvas.width = parseInt(this.canvas.style.width) * 2
    console.log(`canvas width: ${this.canvas.width} and height: ${this.canvas.height}`)
    this.createShapesByState(this.canvas, this.globalGameState);
    this.drawShapes(this.circles);
  }

  createGameString(n: number, m: number): string {
    let string = "";
    for (let i = 0; i < m; i++) {
      string += (n - 1).toString();
    }
    return string;
  }

  moveClick2(x : number, y : number) {
    let i: number = -1;
    let j: number = -1;
    for (const circle of this.circles) {
      if (this.isIntersect2(x , y, circle) === true) {
        i = circle.i;
        j = circle.j;
        if (circle.i === 0 && circle.j === 0) {
          this.turns++;
          this.updateState(circle);
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          console.log("THE GAME HAS ENDED");
          document.getElementById(
            "reserved"
          )!.textContent = `The game has ended in ${this.turns} turns, Player ${
            this.turns % 2 == 0 ? 1 : 2
          } won! `;
          // document.getElementById("Holder2")!.innerHTML = `<button class="bt" type="button">Would you like to play again? If so, click here!</button>`
          // document.getElementById("Holder2")!.addEventListener("click", () => {
          //   location.reload();
          // });
          document
            .getElementById("Holder2")!
            .setAttribute("x-data", "{ open: true }");
          break;
        } else {
          this.turns++;
          this.updateState(circle);
          this.resize2();
          this.circles = this.fitShapes(this.canvas, this.globalGameState);
          this.drawShapes(this.circles);
        }
      }
    }
    return [i, j];
  }

  moveClick(e: MouseEvent) {
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
          document.getElementById(
            "reserved"
          )!.textContent = `The game has ended in ${this.turns} turns, Player ${
            this.turns % 2 == 0 ? 1 : 2
          } won! `;
          // document.getElementById("Holder2")!.innerHTML = `<button class="bt" type="button">Would you like to play again? If so, click here!</button>`
          // document.getElementById("Holder2")!.addEventListener("click", () => {
          //   location.reload();
          // });
          document
            .getElementById("Holder2")!
            .setAttribute("x-data", "{ open: true }");
          break;
        } else {
          this.turns++;
          this.updateState(circle);
          this.circles = this.fitShapes(this.canvas, this.globalGameState);
          this.drawShapes(this.circles);
        }
      }
    }
    return [i, j];
  }

  promptGameState() {
    let n: number = parseInt(
      prompt("Please enter the amount of rows you want (no more than 8)") || "8"
    );
    let m: number = parseInt(
      prompt("Please enter the amount of columns you want (no more than 8)") ||
        "5"
    );
    if (isNaN(n) || n > 8) n = 8;
    if (isNaN(m) || m > 8) m = 8;
    this.n = n;
    this.m = m;
    this.globalGameState = this.createGameString(n, m);
    console.log(`globalGameState is: ${this.globalGameState}`);
    this.resize2();
    this.circles = this.fitShapes(this.canvas, this.globalGameState);
    this.drawShapes(this.circles);
  }

  createShapesByState(canvas: HTMLCanvasElement, state: string): Circle[] {
    // declaring constants
    const width = canvas.width;
    const height = canvas.height;
    console.log(`in createShapes, width: ${width}, height: ${height}`)
    const rows = parseInt(state[0]) + 1;
    const columns = state.length;

    // declaring an array which will eventually include all the shapes
    let shapes = [];

    // empty space gap from the corners (from both sides)
    const gapX = Math.floor(width * 0.1 * 0.5);
    // const gapY = Math.floor(height * 0.1 * 0.5);
    const gapY = Math.floor(height * 0.1 * 0.5);

    // calculating maximum bound radius
    const r = Math.floor(
      width > height
        ? (height * 0.85) / (rows > columns ? rows : columns) / 2
        : (width * 0.85) / (rows > columns ? rows : columns) / 2
    );

    // calculating the gap between the space the shapes take and space the canvas has
    const dx = Math.round((width * 0.05) / (columns - 1));
    const dy = Math.round((height * 0.05) / (rows - 1));
    // calculating xI - the first x position we can a shape at
    // and yI - the first y position we can a shape at
    const xI = gapX + r,
      xE = gapX + 2 * r * columns + dx * (columns - 1);
    const yI = gapY + r,
      yE = gapY + 2 * r * rows + dy * (rows - 1);

    // creating the shapes
    for (let j = 0; j < columns; j++) {
      for (let i = 0; i <= parseInt(this.globalGameState[j]); i++) {
        let count_dx = j * dx > 0 ? j * dx : 0;
        let count_dy = i * dy > 0 ? i * dy : 0;
        let fix_lean =
          width - xE + r < 0 || Math.abs(width - xE + r) / 4 + xE > width
            ? 0
            : (width - xE) / 4;
        const x = Math.round(xI + j * 2 * r + count_dx + fix_lean);
        const y = Math.round(yI +  (i) * 2 * r + count_dy);
        let shape = new Circle(x, y, r, rows - i - 1, j, this.inGame(i, j));
        // let shape = new Circle(x, y, r, rows - i - 1, j, this.inGame(i, j));
        shapes.push(shape);
      }
    }
    return shapes;
  }

  fitShapes(canvas: HTMLCanvasElement, state: string): Circle[] {
    // declaring constants
    const kSpace = 0.05; // the empty space
    const rows = parseInt(state[0]) + 1;
    const columns = state.length;

    // declaring an array which will eventually include all the shapes
    let shapes = [];

    // empty space gap from the corners (from both sides)
    const gapX = canvas.width - canvas.width * (1 - kSpace);
    // const gapY = Math.floor(height * 0.1 * 0.5);
    const gapY = canvas.height - canvas.height * (1 - kSpace);

    // calculating maximum bound radius
    // triple kSpace because there is one on each side of the canvas and than another
    // between the circles
    const r = Math.floor(
      canvas.width > canvas.height
        ? (canvas.height * (1 - kSpace * 3)) /
            (rows > columns ? rows : columns) /
            2
        : (canvas.width * (1 - kSpace * 3)) /
            (rows > columns ? rows : columns) /
            2
    );

    // calculating the gap between the space the shapes take and space the canvas has
    const dx = Math.round((canvas.width * kSpace) / (columns - 1));
    const dy = Math.round((canvas.height * kSpace) / (rows - 1));
    // calculating xI - the first x position we can a shape at
    // and yI - the first y position we can a shape at
    const xI = gapX + r,
      xE = gapX + 2 * r * columns + dx * (columns - 1);
    const yI = gapY + r,
      yE = gapY + 2 * r * rows + dy * (rows - 1);
    // const xI = canvas.width - gapX - r,
    //   xE = gapX + r;
    // const yI = canvas.height - gapY - r,
    //   yE = gapY + r;

    // creating the shapes
    
    let fix_lean =
      canvas.width - xE + r < 0 ||
      Math.abs(canvas.width - xE + r) / 4 + xE > canvas.width
        ? 0
        : (canvas.width - xE) / 4;
    for(let j = 0; j < columns; j++) {
      const jRows = parseInt(this.globalGameState[j]);
      const yGo = canvas.height - jRows * (gapY + 2*r) - dy * (jRows - 1) - r;
      for(let i = 0; i <= parseInt(this.globalGameState[j]); i++) {
        const x = Math.round(xI + j * 2 * r + dx + fix_lean);
        const y = Math.round(yGo +  (i) * 2 * r + dy);
        let shape = new Circle(x, y, r, rows - i - 1, j, this.inGame(i, j));
        shapes.push(shape);
      }
    }


    // for (let j = 0; j < columns; j++) {
    //   for (let i = 0; i <= parseInt(this.globalGameState[j]); i++) {
    //     let count_dx = j * dx > 0 ? j * dx : 0;
    //     let count_dy = i * dy > 0 ? i * dy : 0;
    //     let fix_lean =
    //       canvas.width - xE + r < 0 ||
    //       Math.abs(canvas.width - xE + r) / 4 + xE > canvas.width
    //         ? 0
    //         : (canvas.width - xE) / 4;
    //     const x = Math.round(xI + j * 2 * r + count_dx + fix_lean);
    //     const y = Math.round(yE - i * 2 - r - count_dy);
    //     let shape = new Circle(x, y, r, i, j, this.inGame(i, j));
    //     shapes.push(shape);
    //   }
    // }

    return shapes;
  }

  updateState(c: Circle) {
    let newState = this.computeState(this.globalGameState, c.i, c.j);
    console.log(`state was ${this.globalGameState} and is now ${newState}`);
    console.log(`circle is ${c}`);
    this.globalGameState = newState;
  }

  computeState(state: string, i: number, j: number) {
    // pressing the poisioned piece
    if (i === 0 && j === 0) return "";
    // pressing on the ground row
    else if (i === 0) return state.slice(0, j);
    // pressing on the first column
    else if (j === 0) {
      let string = (i - 1).toString();
      for (let index = 1; index < state.length; index++) {
        if (parseInt(state[index]) > i - 1) string += (i - 1).toString();
        else string += state[index];
      }
      return string;
    }
    let string: string = "";
    if (j === 1) string = state[0];
    else string = state.slice(0, j);
    for (let index = j; index < state.length; index++) {
      // height below the action:
      if (parseInt(state[index]) < i) {
        string += state[index];
      }
      // same or above the action height (action height - i can not be 0)
      else {
        string += (i - 1).toString();
      }
    }
    return string;
  }

  drawShapes(shapes: Circle[] = this.circles) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const circle of shapes) {
      if (circle.shouldDraw === true) {
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
        // this.ctx.fillStyle = "black";
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
      }
    }
  }

  inGame(i: number, j: number) {
    if (j > this.globalGameState.length - 1) return false;
    return i <= parseInt(this.globalGameState[j]);
  }

  isIntersect(point: point, circle: Circle) {
    const distance = Math.sqrt(
      Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2)
    );
    return distance < circle.r;
  }

  isIntersect2(x : number, y : number, circle: Circle) {
    const distance = Math.sqrt(
      Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)
    );
    return distance < circle.r;
  }

  getMousePos(e: MouseEvent) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
}
