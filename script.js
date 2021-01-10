document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(grid.querySelectorAll('div'));
    const GRID_WIDTH = 10;
    const height = 20;
    let currentPosition = 4;

    //=========assign functions to keycodes==========
    function control(e) {
        if(e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    //============The Tetrominoes============
    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ];

    const zTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ];

    const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ];

    const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ];

    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    //=======randomly select tetromino===========
    let random = Math.floor(Math.random() * tetrominoes.length);
    let currentRotation = 0;
    let current = tetrominoes[random][currentRotation];

    //============draw the shape==================
    function draw() {
        current.forEach(index => (
            squares[currentPosition + index].classList.add('block')
        ))
    }

    //=========undraw the shape=============
    function undraw () {
        current.forEach(index => (
            squares[currentPosition + index].classList.remove('block')
        ))
    }

    //==========move down shape===============
    function moveDown () {
        undraw();
        currentPosition = currentPosition += GRID_WIDTH;
        draw();
        freeze();
    }

    //============move right and prevent collisions with shapes moving right=======
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1;
        }
        draw();
    }

    //============move right and prevent collisions with shapes moving right=======
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === 0);
        if(!isAtLeftEdge) currentPosition -= 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1;
        }
        draw();
    }
    
    //==========rotate tetromino==========
    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = tetrominoes[random][currentRotation];
        draw();

    }


});