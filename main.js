let width;
let height;
let depth;

let cellSize;

let columns;
let rows;
let aisles;
let currentState;
let nextState;
let elArray;

let onColor = "#203744";
let middleColor = "#84a2d4";
let offColor = "white";

let caContainer = null;
let aScene = null;

const initDefinition = () => {
    width = 15;
    height = 15;
    depth = 15;

    cellSize = 1;
    //修正する
    //columns = Math.floor(width / cellSize);
    //rows = Math.floor(height / cellSize);
    //aisles = Math.floor(depth / cellSize);
    columns = 10;
    rows =10;
    aisles =10;


    //create 3-dimension Matrix

    currentState = new Array(columns);
    for (let i = 0; i < columns; i++) {
        currentState[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            currentState[i][j] = new Array(aisles);
        }
    }
    nextState = new Array(columns);
    for (i = 0; i < columns; i++) {
        nextState[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            nextState[i][j] = new Array(aisles);
        }
    }
    elArray = new Array(columns);
    for (i = 0; i < columns; i++) {
        elArray[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            elArray[i][j] = new Array(aisles);
        }
    }
};

//set the initial position 
const initContainerPosition = () => {
    caContainer = document.getElementById("ca-container");
    caContainer.setAttribute("position", `0 1 ${-height * 1.3}`);
};

const initAddGrid = () => {
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            for (let z = 0; z < aisles; z++) {
                const newEl = document.createElement("a-box");
                newEl.setAttribute("color", offColor);
                newEl.setAttribute(
                    "scale",
                    `${cellSize} ${cellSize} ${cellSize}`
                );
                newEl.setAttribute(
                    "position",
                    `${y - width / 2} ${z - height / 2} ${x - depth / 2}`
                );
                newEl.setAttribute("opacity", 0.1);
                caContainer.appendChild(newEl);
                elArray[x][y][z] = newEl;
            }
        }
    }
};

const initRandomSet = () => {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            for (let k = 0; k < aisles; k++) {
                if (
                    i == 0 ||
                    j == 0 ||
                    k == 0 ||
                    i == columns - 1 ||
                    j == rows - 1 ||
                    k == aisles - 1
                )
                    currentState[i][j][k] = 0;
                else currentState[i][j][k] = Math.round(Math.random(2));
            }
        }
    }
};

/*const initRandomSet = () => {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            for (let k = 0; k < aisles; k++) {
                currentState[i][j][k] = Math.round(Math.random(2));
            }
        }
    }
}*/


const drawCa = () => {
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            for (let k = 0; k < aisles; k++) {
                if (currentState[i][j][k] == 1) onAttribute(i, j, k);
                else offAttribute(i, j, k);
                if (currentState[i][j][k] == 1 && nextState[i][j][k] == 0)
                    middleAttribute(i, j, k);
            }
        }
    }
};

const onAttribute = (i, j, k) => {
    elArray[i][j][k].setAttribute("color", onColor);
    elArray[i][j][k].setAttribute("opacity", 1);
    elArray[i][j][k].setAttribute("visible", true);
};

const offAttribute = (i, j, k) => {
    elArray[i][j][k].setAttribute("visible", false);
};

const middleAttribute = (i, j, k) => {
    elArray[i][j][k].setAttribute("color", middleColor);
    elArray[i][j][k].setAttribute("visible", true);
};

function generate() {
    for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
            for (let z = 1; z < aisles - 1; z++) {
                let neighbors = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        for (let k = -1; k <= 1; k++) {
                            neighbors += currentState[x + i][y + j][z + k];
                        }
                    }
                }
                neighbors -= currentState[x][y][z];
                // loneliness
                if (currentState[x][y][z] == 1 && neighbors < 2)
                    nextState[x][y][z] = 0;
                // overpopulation
                else if (currentState[x][y][z] == 1 && neighbors > 5)
                    nextState[x][y][z] = 0;
                // reqroduction
                else if (currentState[x][y][z] == 0 && neighbors == 5)
                    nextState[x][y][z] = 1;
                //stasis
                else nextState[x][y][z] = currentState[x][y][z];
            }
        }
    }

    let temp = currentState;
    currentState = nextState;
    nextState = temp;
}

window.onload = () => {
    initDefinition();
    initContainerPosition();
    initAddGrid();
    initRandomSet();
    drawCa();
    setInterval(() => {
        drawCa();
    }, 700);
};
