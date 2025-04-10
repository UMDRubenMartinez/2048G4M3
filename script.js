const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const gridSize = 4;
let grid;
let score = 0;

const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

function createGrid() {
    grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
}

function updateGridDisplay() {
    gridContainer.innerHTML = ''; // Limpiar el contenedor
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            if (grid[i][j] > 0) {
                cell.textContent = grid[i][j];
                cell.classList.add(`value-${grid[i][j]}`);
            }
            gridContainer.appendChild(cell);
        }
    }
    scoreDisplay.textContent = score;
}

function placeNewTile() {
    const emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4; // 90% probabilidad de 2, 10% de 4
    }
}

function move(direction) {
    let changed = false;

    const moveRow = (row) => {
        const nonZero = row.filter(val => val !== 0);
        const merged = [];
        for (let i = 0; i < nonZero.length; i++) {
            if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
                merged.push(nonZero[i] * 2);
                score += nonZero[i] * 2;
                i++;
                changed = true;
            } else {
                merged.push(nonZero[i]);
            }
        }
        while (merged.length < gridSize) {
            merged.push(0);
        }
        return merged;
    };

    const moveCol = (colIndex) => {
        const column = grid.map(row => row[colIndex]);
        const movedColumn = moveRow(column);
        movedColumn.forEach((val, index) => grid[index][colIndex] = val);
        if (!arraysEqual(column, movedColumn)) changed = true;
    };

    const moveRowDirection = (rowIndex) => {
        const row = [...grid[rowIndex]];
        let movedRow;
        if (direction === 'left') {
            movedRow = moveRow(row);
        } else if (direction === 'right') {
            movedRow = moveRow(row.reverse()).reverse();
        }
        if (!arraysEqual(grid[rowIndex], movedRow)) changed = true;
        grid[rowIndex] = movedRow;
    };

    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < gridSize; i++) {
            moveRowDirection(i);
        }
    } else if (direction === 'up' || direction === 'down') {
        for (let j = 0; j < gridSize; j++) {
            const column = grid.map(row => row[j]);
            let movedColumn;
            if (direction === 'up') {
                movedColumn = moveRow(column);
            } else if (direction === 'down') {
                movedColumn = moveRow(column.reverse()).reverse();
            }
            movedColumn.forEach((val, index) => grid[index][j] = val);
            if (!arraysEqual(column, movedColumn)) changed = true;
        }
    }

    if (changed) {
        placeNewTile();
        updateGridDisplay();
        checkGameOver();
    }
}

function arraysEqual(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function checkGameOver() {
    // Comprobar si hay celdas vacías
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                return; // Todavía hay movimientos posibles
            }
        }
    }

    // Comprobar si hay fichas adyacentes con el mismo valor
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (i + 1 < gridSize && grid[i][j] === grid[i + 1][j]) return;
            if (j + 1 < gridSize && grid[i][j] === grid[i][j + 1]) return;
        }
    }

    alert(`¡Game Over! Puntuación final: ${score}`);
}

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
}

function restartGame() {
    createGrid();
    score = 0;
    placeNewTile();
    placeNewTile();
    updateGridDisplay();
}

// Inicialización del juego
createGrid();
placeNewTile();
placeNewTile();
updateGridDisplay();

// Event listeners
upButton.addEventListener('click', () => move('up'));
downButton.addEventListener('click', () => move('down'));
leftButton.addEventListener('click', () => move('left'));
rightButton.addEventListener('click', () => move('right'));
document.addEventListener('keydown', handleKeyDown);
restartButton.addEventListener('click', restartGame);