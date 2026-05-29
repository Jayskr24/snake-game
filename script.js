const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-board");

let box = 20; 
let score = 0;

let snake = [{ x: 10 * box, y: 10 * box }]; 
let d = "RIGHT"; 

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

// Variables to track touch positions
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// --- CONTROLS ---

// 1. Keyboard Controls
document.addEventListener("keydown", direction);

function direction(event) {
    if ((event.key === "ArrowLeft" || event.key === "a") && d !== "RIGHT") d = "LEFT";
    else if ((event.key === "ArrowUp" || event.key === "w") && d !== "DOWN") d = "UP";
    else if ((event.key === "ArrowRight" || event.key === "d") && d !== "LEFT") d = "RIGHT";
    else if ((event.key === "ArrowDown" || event.key === "s") && d !== "UP") d = "DOWN";
}

// 2. Touch Controls (Mobile Swipe)
canvas.addEventListener("touchstart", function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: false });

// Prevent scrolling when touching the canvas game area
canvas.addEventListener("touchmove", function(event) {
    event.preventDefault(); 
}, { passive: false });

canvas.addEventListener("touchend", function(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}, { passive: false });

function handleSwipe() {
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;
    
    // Minimum distance required to count as a intentional swipe (in pixels)
    const threshold = 30; 

    // Check if the swipe was horizontal or vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && d !== "LEFT") d = "RIGHT";
            else if (diffX < 0 && d !== "RIGHT") d = "LEFT";
        }
    } else {
        // Vertical Swipe
        if (Math.abs(diffY) > threshold) {
            if (diffY > 0 && d !== "UP") d = "DOWN";
            else if (diffY < 0 && d !== "DOWN") d = "UP";
        }
    }
}

// --- GAME LOGIC ---

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
        ctx.fillStyle = (i === 0) ? "#00FF00" : "#008000"; 
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

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = `Score: ${score}`;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop(); 
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("Game Over! Final Score: " + score);
        location.reload(); 
    }

    snake.unshift(newHead); 
}

let game = setInterval(draw, 150);
