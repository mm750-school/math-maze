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

ctx.fillStyle = "rgb(200 0 0)";
ctx.fillRect(center.x - 25, center.y - 25, 50, 50);

ctx.fillStyle = "rgb(0 0 200 / 50%)";
ctx.fillRect(10 + center.x - 25, 10 + center.y - 25, 50, 50);

const size = 10;
generateMaze(size)

function generateMaze(size) {
  /*
      grid array: 0 = wall cell, 1 = passage
  */
  let grid = Array.from(Array(size), _ => Array(size).fill(0));
  let walls = []

  const starting_cell = new Vector(0, 0)

  let current_cell = starting_cell

  const current_x = current_cell.x
  const current_y = current_cell.y
  //current cell has undefined valuess

  if (current_x + 1 <= size) {
    walls.push([[current_cell.x + 1][current_cell.y]])
  }
  if (current_x - 1 >= 0) {
    walls.push([[current_cell.x - 1][current_cell.y]])
  }
  if (current_y + 1 <= size) {
    walls.push([[current_cell.x][current_cell.y + 1]])
  }
  if (current_y - 1 >= 0) {
    walls.push([[current_cell.x][current_cell.y - 1]])
  }
  console.log(walls)
  while (walls.length != 0) {
    const random = Math.floor(Math.random() * walls.length)

    let wall = walls[random]
    console.log(walls)
    let adjacent_values = getAdjacentValues(grid, wall)
    let adjacent_value_count = 0
    adjacent_values.forEach(value => {
      if (value == 0) {
        adjacent_value_count++
      }
    })
    if (adjacent_value_count == 1) {
      grid[wall.x][wall.y] = 1
      let adjacent_cells = getAdjacentCells(grid, wall)
      for (let i = 0; i < adjacent_cells.length; i++) {
        if (adjacent_values[i] == 0) {
          walls.push(adjacent_cells[i])
        }
      }
    }
    const index = walls.indexOf(wall)
    if (index !== -1) {
      walls.splice(index, 1)
    }
  }
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
  const current_x = current_cell.x
  const current_y = current_cell.y

  let adjacent = []
  adjacent.push([[current_cell.x + 1][current_cell.y]])

  if (current_x + 1 <= size) {
    adjacent.push([[current_cell.x + 1][current_cell.y]])
  }
  if (current_x - 1 >= 0) {
    adjacent.push([[current_cell.x - 1][current_cell.y]])

  }
  if (current_y + 1 <= size) {
    adjacent.push([[current_cell.x][current_cell.y + 1]])
  }
  if (current_y - 1 >= 0) {
    adjacent.push([[current_cell.x][current_cell.y - 1]])
  }
  return adjacent
}
function getAdjacentValues(grid, current_cell) {
  //wraps getAdjacentCells
  const cells = getAdjacentCells(grid, current_cell)
  let values = []

  cells.forEach(cell => {
    values.push(grid[cell.x][cell.y])
  });
  return values
}