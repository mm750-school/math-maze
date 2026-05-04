class Vector {
  constructor(x, y) {
    this.x = x | 0
    this.y = y | 0
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dimensions = new Vector(canvas.width, canvas.height)
const center = new Vector(dimensions.x / 2, dimensions.y / 2);
console.log(center);

ctx.fillStyle = "rgb(200 0 0)";
ctx.fillRect(center.x - 25, center.y - 25, 50, 50);

ctx.fillStyle = "rgb(0 0 200 / 50%)";
ctx.fillRect(10 + center.x - 25, 10 + center.y - 25, 50, 50);

function generateMaze() {
  /*
  given a grid of cells. use recursive division to 
  create a maze where a cell can either be a wall or open.
  
  */
}
