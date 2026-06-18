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
class rect {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

const character = {
    x: 60,
    y: 60,
    size: 5,
    speed: 2,
    color: '#00ffcc'
};

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dimensions = new Vector(canvas.width, canvas.height)

const generateButton = document.getElementById("generate")

let finished = false;
let finishedCell

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
    finishedCell = deepestCell
    braid()

    console.log(masterOfCells)
}

function braid() {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (masterOfCells[i][j].openTo.length == 1) {
                let current = masterOfCells[i][j]
                let neighbours = getNeighbours(current)
                let chosen = neighbours[Math.floor(Math.random() * neighbours.length)]

                current.openTo.push(chosen)
                current.openDirection.push(getDirection(current, chosen))
                chosen.openTo.push(current)
                chosen.openDirection.push(getDirection(chosen, current))
            }
        }
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
            ctx.fillStyle = cell.visible ? "rgb(146, 90, 70)" : "rgb(0, 0, 0)"
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
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height)
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
                walls.push(new rect(x + cellSize, y, 5, cellSize));
            }

            // top wall
            if (!cell.openDirection.includes("north")) {
                walls.push(new rect(x, y, cellSize, 5));
            }

            // left wall
            if (!cell.openDirection.includes("west")) {
                walls.push(new rect(x, y, 5, cellSize));
            }

            // bottom wall
            if (!cell.openDirection.includes("south")) {
                walls.push(new rect(x, y + cellSize, cellSize, 5));
            }
        }
    }
    return walls
}
function updateFog(visibility) {
    let x = Math.floor(character.x / 40)
    let y = Math.floor(character.y / 40)
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(x * 40, y * 40, 5, 5)

    if (masterOfCells[x][y]) {
        masterOfCells[x][y].openTo.forEach(open => {
            masterOfCells[open.x][open.y].visible = true;
            if (visibility == 2) {
                masterOfCells[open.x][open.y].openTo.forEach(second => {
                    masterOfCells[second.x][second.y].visible = true;
                })
            }
        })
        masterOfCells[x][y].visible = true;
    }

}

function updateCharacter() {
    let colliding = false;
    let collidingWall = []
    walls.forEach(wall => {
        let distanceX = wall.x - character.x
        let distanceY = wall.y - character.y
        if (distanceX <= 100 && distanceY <= 100) {
            if (checkRectCircleCollision(wall, character)) {
                colliding = true
                collidingWall.push(new Vector(wall.x, wall.y))
            }
        }
    })
    if (colliding) {
        character.color = '#fff700'
    }
    else {
        character.color = '#00ffcc'
    }
    directions_blocked = []
    collidingWall.forEach(wall => {
        if (wall.y - character.y > 0) {
            directions_blocked.push("south")
            console.log(wall.y, 0, "south")

        } if (wall.y - character.y < 0) {
            directions_blocked.push("north")
            console.log(wall.y, 0, "north")

        }
        if (wall.x - character.x > 0) {
            directions_blocked.push("east")
            console.log(wall.x, 0, "east")

        } if (wall.x - character.x < 0) {
            directions_blocked.push("west")
            console.log(wall.x, 0, "west")

        }
    })
    console.log(directions_blocked)
    collision_north = directions_blocked.includes("north")
    collision_south = directions_blocked.includes("south")
    collision_west = directions_blocked.includes("west")
    collision_east = directions_blocked.includes("east")
    if (keys.w && !collision_north || keys.ArrowUp && !collision_north) character.y -= character.speed;
    if (keys.s && !collision_south || keys.ArrowDown && !collision_south) character.y += character.speed;
    if (keys.a && !collision_west || keys.ArrowLeft && !collision_west) character.x -= character.speed;
    if (keys.d && !collision_east || keys.ArrowRight && !collision_east) character.x += character.speed;
    //console.log("position:" + character.x, character.y)

    let x = Math.floor(character.x / 40)
    let y = Math.floor(character.y / 40)
    if (x == finishedCell.x && y == finishedCell.y) {
        finished = true
    }
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
    if (finished) {
        ctx.fillStyle = "rgb(256, 256, 256)"
        ctx.font = "120px Arial";
        ctx.fillText("FINISHED!", 10, dimensions.y / 2, dimensions.x)
    }

}
function checkRectCircleCollision(rect, circle) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    return distanceSquared <= (circle.size * circle.size);
}

function gameLoop() {
    updateCharacter()

    render()
    updateFog(2)

    requestAnimationFrame(gameLoop)
}

