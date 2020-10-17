console.log(`Loaded at ${Date()}`)

const boardBorder = 'black';
const boardBackground = 'white';
const snakeBorder = 'darkblue'
const snakeColor = 'lightblue';
const foodBorder = 'darkgreen';
const foodColor = 'lightgreen';

const board = document.getElementById('gameCanvas');
const boardCtx = board.getContext('2d');

// build the snake in the middle of the board, over 40 px
let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
]

let score = 0;
let food = {x: 0, y: 0};
// only true when changing direction
let changing_direction = false;
// horizontal velocity
let dx = 10;
// vertical velocity
let dy = 0;

start();
createFood();
document.addEventListener('keydown', changeDirection);

function start () {
    if (!has_game_ended()) {
        changing_direction = false
        setTimeout(() => {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            start();
        }, 100);
    }
}

function clearCanvas () {
    //  Select the colour to fill the drawing
    boardCtx.fillStyle = boardBackground;
    //  Select the colour for the border of the canvas
    boardCtx.strokestyle = boardBorder;
    // Draw a "filled" rectangle to cover the entire canvas
    boardCtx.fillRect(0, 0, board.width, board.height);
    // Draw a "border" around the entire canvas
    boardCtx.strokeRect(0, 0, board.width, board.height);
}

function drawSnakePart (snakePart) {
    boardCtx.fillStyle = snakeColor;
    boardCtx.strokeStyle = snakeBorder; 
    boardCtx.fillRect(snakePart.x, snakePart.y, 10, 10);
    boardCtx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake () {
    snake.forEach(drawSnakePart);
}

function moveSnake () {
    // Create the new Snake's head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    // Add the new head to the beginning of snake body
    snake.unshift(head);
    
    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score = score + 10;

        document.getElementById('score').innerHTML = score;

        createFood();
    } else {
        snake.pop();
    }
    
}

function changeDirection (event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (!changing_direction) {
        changing_direction = true
        const keyPressed = event.keyCode;
        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === 10;
        const goingLeft = dx === -10;
    
        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -10;
            dy = 0;
        }
    
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 10;
            dy = 0;
        }
    
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -10;
        }
    
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 10;
        }
    }
}

function has_game_ended () {
    for (let i = 4; i < snake.length; i++) {
        const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (has_collided) {
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > board.width - 10; 
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > board.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10 ) * 10;
}

function createFood() {
    food.x = randomFood(0, board.width - 10);
    food.y = randomFood(0, board.height - 10);

    snake.forEach((part) => {
        const hasEaten = part.x == food.x && part.y == food.y;
        if (hasEaten) {
            createFood();
        }
    })
}

function drawFood () {
    boardCtx.fillstyle = foodColor;
    boardCtx.strokeStyle = foodBorder;
    boardCtx.fillRect(food.x, food.y, 10, 10);
    boardCtx.strokeRect(food.x, food.y, 10, 10);
}