const canvas = document.getElementById('gameCanvas');
const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
canvas.width = smallerDimension * 0.7;
canvas.height = smallerDimension * 0.7;

const ctx = canvas.getContext('2d');
const cellSize = canvas.width / 100;

const gridSize = 100;
let grid = generateRandomGrid(gridSize);
let colorPhase = 0;

document.getElementById('startButton').onclick = startButtonClicked;

function startButtonClicked() {
    document.getElementById('startButton').style.display = 'none';
    startGame();
}

function startGame() {
    let iterations = 0;
    let unchangedIterations = 0;
    let lastAliveCells = -1;
    const gameInterval = setInterval(() => {
        drawGrid(grid);
        const newGrid = getNextGrid(grid);
        const aliveCells = countAliveCells(newGrid);

        colorPhase = (colorPhase + 1) % 360; // Update color phase
        if (aliveCells === lastAliveCells) {
            unchangedIterations++;
        } else {
            unchangedIterations = 0;
        }

        if (iterations >= 10 && unchangedIterations >= 10) {
            clearInterval(gameInterval);
        } else {
            grid = newGrid;
            lastAliveCells = aliveCells;
            iterations++;
        }
    }, 100);
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {

            ctx.fillStyle = cell ? getRainbowColor(colorPhase) : 'white';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeStyle = 'lightgray';
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        });
    });
}

function getRainbowColor(phase) {
    const frequency = 0.05;
    const red   = Math.sin(frequency * phase + 0) * 127 + 128;
    const green = Math.sin(frequency * phase + 2 * Math.PI / 3) * 127 + 128;
    const blue  = Math.sin(frequency * phase + 4 * Math.PI / 3) * 127 + 128;

    return `rgb(${red}, ${green}, ${blue})`;
}

function generateRandomGrid(size) {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => Math.random() >= 0.5)
    );
}

function getNextGrid(grid) {
    return grid.map((row, i) =>
        row.map((cell, j) => {
            const aliveNeighbors = countAliveNeighbors(grid, i, j);
            if (cell) {
                return aliveNeighbors === 2 || aliveNeighbors === 3;
            } else {
                return aliveNeighbors === 3;
            }
        })
    );
}

function countAliveNeighbors(grid, i, j) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    let count = 0;

    directions.forEach(([di, dj]) => {
        const ni = (i + di + gridSize) % gridSize;
        const nj = (j + dj + gridSize) % gridSize;

        count += grid[ni][nj] ? 1 : 0;
    });

    return count;
}


function countAliveCells(grid) {
    let count = 0;

    grid.forEach(row => {
        row.forEach(cell => {
            if (cell) count++;
        });
    });

    return count;
}
