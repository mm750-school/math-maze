class Vector {
  constructor(x, y) {
    this.x = x | 0
    this.y = y | 0
  }
  toJSON() {
    return { type: "Vector", x: this.x, y: this.y }
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dimensions = new Vector(canvas.width, canvas.height)
const center = new Vector(dimensions.x / 2, dimensions.y / 2);

ctx.fillStyle = "rgb(200 0 0)";
ctx.fillRect(center.x - 25, center.y - 25, 50, 50);

ctx.fillStyle = "rgb(0 0 200 / 50%)";
ctx.fillRect(10 + center.x - 25, 10 + center.y - 25, 50, 50);

const size = 10;
generateMaze(size)

function generateMaze(size) {
  /*
      grid array: 0 = wall cell, 1 = passage
      visited array: 0 = unvisited, 1 = visited
  */
  let grid = Array.from(Array(size), _ => Array(size).fill(0));
  let visited = Array.from(Array(size), _ => Array(size).fill(0));
  let walls = []

  let current_cell = new Vector(1, 1)
  grid[current_cell.x][current_cell.y] = 1 // passage
  visited[current_cell.x][current_cell.y] = 1 // visited

  if (current_cell.x + 1 <= size) {
    walls.push(new Vector(current_cell.x + 1, current_cell.y))
  }
  if (current_cell.x - 1 >= 0) {
    walls.push(new Vector(current_cell.x - 1, current_cell.y))
  }
  if (current_cell.y + 1 <= size) {
    walls.push(new Vector(current_cell.x, current_cell.y + 1))
  }
  if (current_cell.y - 1 >= 0) {
    walls.push(new Vector(current_cell.x, current_cell.y - 1))
  }

  while (walls.length != 0) {
    console.log("length: " + walls.length)
    const random = Math.floor(Math.random() * walls.length)

    let wall = walls[random]

    let adjacent_visited = getAdjacentValues(grid, visited, wall)
    console.log("adj" + adjacent_visited)

    let adjacent_visited_count = 0

    adjacent_visited.forEach(value => {
      if (value == 1) {
        adjacent_visited_count++
      }
    })
    if (adjacent_visited_count <= 2) {
      console.log("WE HSVE WALL")
      grid[wall.x][wall.y] = 1 // passage
      let adjacent_cells = getAdjacentCells(grid, wall)
      for (let i = 0; i < adjacent_cells.length; i++) {
        if (adjacent_visited[i] == 0) {
          walls.push(getAdjacentCells(grid, adjacent_cells[i]))
          visited[adjacent_cells[i].x][adjacent_cells[i].y]
          console.log("walls.length + 1")
        }
      }
    }
    walls.splice(random)
  }
  console.log("below is maze")
  console.log(grid)

  /*
  * start with a grid full of walls
  * pick a cell on the edge of the grid, mark it as part of the maze.
  * add the adjcent cells to the wall list
  * while ther are wall cells in the list:
  *   pick a random wall cell from the list.
  *   if only one of the adjacent cells that the wall cell divides is visted, then:
  *     make the wall a passage and mark the unvisted cell as part of the maze.
  *     add the neighbouring wall cells(unvisited adjacent cells) to the wall list.
  *   remove the wall from the list.
  */
}
function getAdjacentCells(grid, current_cell) {
  let adjacent = []

  if (current_cell.x + 1 <= size) {
    adjacent.push(new Vector(current_cell.x + 1, current_cell.y))
  }
  if (current_cell.x - 1 >= 0) {
    adjacent.push(new Vector(current_cell.x - 1, current_cell.y))

  }
  if (current_cell.y + 1 <= size) {
    adjacent.push(new Vector(current_cell.x, current_cell.y + 1))
  }
  if (current_cell.y - 1 >= 0) {
    adjacent.push(new Vector(current_cell.x, current_cell.y - 1))
  }
  return adjacent
}
function getAdjacentValues(grid, visited, current_cell) {
  //wraps getAdjacentCells
  const cells = getAdjacentCells(grid, current_cell)
  let values = []
  cells.forEach(cell => {
    values.push(visited[cell.x | 0][cell.y | 0])
  });
  return values
}