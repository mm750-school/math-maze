class Vector {
    constructor(x, y) {
        this.x = x | 0
        this.y = y | 0
    }
    toJSON() {
        return { type: "Vector", x: this.x, y: this.y }
    }
}
class Cell {
    constructor(x, y) {
        this.x = x | 0
        this.y = y | 0
        this.visited = false
        this.openTo = []
    }
    toJSON() {
        return { type: "Cell: " + this.visited, x: this.x, y: this.y }
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dimensions = new Vector(canvas.width, canvas.height)
const center = new Vector(dimensions.x / 2, dimensions.y / 2);

const size = 10
let masterOfCells = Array.from(Array(size), _ => Array(size).fill(new Cell()));

for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        masterOfCells[i][j] = new Cell(i, j)
    }
}
update(masterOfCells[1][1])
console.log(masterOfCells)


function update(cell) {
    cell.visited = true;
    neighbours = getNeighbours(cell)
    var unvisited = []
    unvisited.push(...neighbours)
    neighbours.forEach(neighbour => {
        if (!neighbour.visited) {
            unvisited.push(neighbour)
        }
    });

    while (unvisited.length != 0) {
        chosen = unvisited[Math.floor(Math.random() * unvisited.length)]
        cell.openTo.push(chosen)
        chosen.openTo.push(cell)
        unvisited.splice(chosen)
        update(chosen)
    }
}
function getNeighbours(cell) {
    x = cell.x
    y = cell.y

    let neighbours = []

    if (x + 1 < size) {
        neighbours.push(masterOfCells[x + 1][y])
    }
    if (x - 1 >= 0) {
        neighbours.push(masterOfCells[x - 1][y])
    }
    if (y + 1 < size) {
        neighbours.push(masterOfCells[x][y + 1])
    }
    if (y - 1 >= 0) {
        neighbours.push(masterOfCells[x][y - 1])
    }

    let filtered = []
    neighbours.forEach(element => {
        if (element !== null) {
            if (!element.visited) {
                filtered.push(element)
            }
        }
    });
    return filtered
}

function displayCells() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            ctx.fillStyle = masterOfCells[i][j].visited ? "rgb(255, 0, 0)" : "rgb(49, 105, 118)"
            ctx.fillRect((dimensions.x / size) * (i + 1), (dimensions.y / size) * (j + 1), 20, 20)
        }
    }
}
displayCells()