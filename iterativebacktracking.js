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
        this.depth = -1
        this.isDeepest
        this.openTo = []
        this.openDirection = []
        this.visible = false
    }
    toJSON() {
        return { type: "Cell: " + this.visited, x: this.x, y: this.y }
    }
}

const character = {
    x: 80,
    y: 80,
    size: 10,
    speed: 2,
    color: '#00ffcc'
};

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dimensions = new Vector(canvas.width, canvas.height)

const generateButton = document.getElementById("generate")


const size = 15
let masterOfCells = Array.from(Array(size), _ => Array(size).fill(new Cell()));

for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        masterOfCells[i][j] = new Cell(i, j)
    }
}
visitedStack = []


window.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

explore(masterOfCells[1][1])
const walls = calculateWalls()
gameLoop()


async function explore(startCell) { //iterative with stack
    startCell.visited = true;
    startCell.depth = 0;

    let deepestCell = startCell
    let maxDepth = 0
    let stack = [startCell]

    while (stack.length) {
        current = stack.pop()

        neighbours = getNeighbours(current)
        unvisitedNeighbours = []
        neighbours.forEach(neighbour => {
            if (neighbour.visited == false) {
                unvisitedNeighbours.push(neighbour)
            }
        });

        if (unvisitedNeighbours.length) {
            stack.push(current)
            chosen = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)]

            chosen.visited = true;
            chosen.depth = current.depth + 1;

            if (chosen.depth > maxDepth) {
                maxDepth = chosen.depth;
                deepestCell = chosen;
            }
            current.openTo.push(chosen)
            current.openDirection.push(getDirection(current, chosen))
            chosen.openTo.push(current)
            chosen.openDirection.push(getDirection(chosen, current))
            stack.push(chosen)

        }
    }
    deepestCell.isDeepest = true;

    console.log(masterOfCells)
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
            filtered.push(element)
        }
    });
    return filtered
}
function getDirection(first, second) {
    directionX = first.x - second.x
    directionY = first.y - second.y
    if (directionX == -1) {
        return "east"
    }
    else if (directionX == 1) {
        return "west"
    }
    else if (directionY == 1) {
        return "north"
    }
    else if (directionY == -1) {
        return "south"
    }
}

function displayCells() {
    ctx.reset()

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = masterOfCells[i][j]
            const cellSize = 40;
            const halfSize = cellSize / 2

            const cellPos = new Vector(cellSize * i, cellSize * j)
            ctx.fillStyle = cell.visible ? "rgb(0, 212, 250)" : "rgb(146, 90, 70)"
            ctx.fillRect(cellPos.x, cellPos.y, cellSize, cellSize)
            ctx.font = "bold 30px Arial";


            if (cell.isDeepest) {
                ctx.fillStyle = "rgb(49, 105, 118)"
                ctx.fillRect(cellPos.x, cellPos.y, cellSize, cellSize)
            } else if (cell.depth == 0) {
                ctx.fillStyle = "rgb(146, 90, 70)"
                ctx.fillRect(cellPos.x, cellPos.y, cellSize, cellSize)
            }
        }
    }
    ctx.fillStyle = "rgb(0 0 0)"
    walls.forEach(wall => {
        ctx.fillRect(wall[0], wall[1], wall[2], wall[3])
    });
}
function calculateWalls() {
    let walls = []
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = masterOfCells[i][j]
            const cellSize = 40;

            const cellPos = new Vector(cellSize * i, cellSize * j)


            const x = cellPos.x;
            const y = cellPos.y;

            // right wall
            if (!cell.openDirection.includes("east")) {
                walls.push([x + cellSize, y, 5, cellSize]);
            }

            // top wall
            if (!cell.openDirection.includes("north")) {
                walls.push([x, y, cellSize, 5]);
            }

            // left wall
            if (!cell.openDirection.includes("west")) {
                walls.push([x, y, 5, cellSize]);
            }

            // bottom wall
            if (!cell.openDirection.includes("south")) {
                walls.push([x, y + cellSize, cellSize, 5]);
            }
        }
    }
    return walls
}
function updateFog() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            masterOfCells[i][j].visible = false
        }
    }
    let x = Math.round(character.x / 40) - 1
    let y = Math.round(character.y / 40) - 1
    console.log(x, y)

    masterOfCells[x][y].visible = true;
}

function updateCharacter() {

    if (keys.w) character.y -= character.speed;
    if (keys.s) character.y += character.speed;
    if (keys.a) character.x -= character.speed;
    if (keys.d) character.x += character.speed;
    console.log("position:" + character.x, character.y)
}


function render() {
    displayCells()

    ctx.beginPath();
    ctx.arc(character.x, character.y, character.size, 0, 2 * Math.PI);
    ctx.fillStyle = character.color;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = character.color;
    ctx.stroke();
}

function gameLoop() {
    updateCharacter()
    updateFog()
    render()

    requestAnimationFrame(gameLoop)
}

