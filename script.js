const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-board");

let box = 20; // Size of one square
let score = 0;

let snake = [{ x: 10 * box, y: 10 * box }]; // Initial position
let d = "RIGHT"; // Fix 1: Give it a starting direction so it moves right away!

// Fix 2: Keep food strictly within the 0-19 grid (400 / 20 = 20 blocks)
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

document.addEventListener("keydown", direction);

// Fix 3: Updated to use standard event.key instead of deprecated keyCode
function direction(event) {
    if ((event.key === "ArrowLeft" || event.key === "a") && d !== "RIGHT") d = "LEFT";
    else if ((event.key === "ArrowUp" || event.key === "w") && d !== "DOWN") d = "UP";
    else if ((event.key === "ArrowRight" || event.key === "d") && d !== "LEFT") d = "RIGHT";
    else if ((event.key === "ArrowDown" || event.key === "s") && d !== "UP") d = "DOWN";
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#00FF00" : "#008000"; // Head is brighter green
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = `Score: ${score}`;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop(); // Remove tail
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over conditions
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("Game Over! Final Score: " + score);
        location.reload(); // Restart game
    }

    snake.unshift(newHead); // Add new head
}

let game = setInterval(draw, 250); // Slightly speed it up (250ms) for better gameplay!
