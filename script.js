document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const displaySquares = document.querySelectorAll('.previous-grid div');
    const scoreDisplay = document.querySelector('.score-display');
    const linesDisplay = document.querySelector('.lines-display');
    const startBtn = document.querySelector('button');
    let squares = Array.from(grid.querySelectorAll('div'));
    const GRID_WIDTH = 10;
    const height = 20;
    let currentPosition = 4;
    let currentIndex = 0;
    let timerId;
    let score = 0;
    let lines = 0;

    //=========assign functions to keycodes==========
    function control(e) {
        if (e.keyCode === 39) {
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
    function undraw() {
        current.forEach(index => (
            squares[currentPosition + index].classList.remove('block')
        ))
    }

    //==========move down shape===============
    function moveDown() {
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
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1;
        }
        draw();
    }

    //============move right and prevent collisions with shapes moving right=======
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1;
        }
        draw();
    }

    //==========rotate tetromino==========
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = tetrominoes[random][currentRotation];
        draw();
    }


    //=====show previous tetromino is displaySquares============
    const displayWidth = 4;
    const displayIndex = 0;
    let nextRandom = 0;


    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
        [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
        [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('block');
        })

        smallTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block');
        })
    }

    //========freeze shape==========
    function freeze() {
        if (current.some(index => squares[currentPosition + index + GRID_WIDTH].classList.contains('block3')
            || squares[currentPosition + index + GRID_WIDTH].classList.contains('block2'))) {
            current.forEach(index => squares[index + currentPosition].classList.add('block2'));

            random = nextRandom;
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            gameOver();
            addScore();
        }
    }

    //=======start game button========
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 400);
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            displayShape();
        }
    })

    //======game over======
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            scoreDisplay.innerHTML = "The End";
            clearInterval(timerId);
        }
    }


    //=========add score========
    function addScore() {
        for (currentIndex = 0; currentIndex < 200; currentIndex += GRID_WIDTH) {
            const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 10
                lines += 1
                scoreDisplay.innerHTML = score
                linesDisplay.innerHTML = lines
                row.forEach(index => {
                    squares[index].style.backgroundImage = 'none'
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block')

                })
                //splice array
                const squaresRemoved = squares.splice(currentIndex, GRID_WIDTH)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


});