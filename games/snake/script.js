var canvas = document.getElementById('snake-canvas');
var ctx = canvas.getContext('2d');
var gridSize = 20;

var snake = [
    {x: 160, y: 200},
    {x: 140, y: 200},
    {x: 120, y: 200}
];

var dx = gridSize;
var dy = 0;
var foodX = 240;
var foodY = 200;

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -gridSize; }
    else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = gridSize; }
    else if (e.key === 'ArrowLeft' && dx === 0) { dx = -gridSize; dy = 0; }
    else if (e.key === 'ArrowRight' && dx === 0) { dx = gridSize; dy = 0; }
});

function randomFood() {
    foodX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    foodY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function checkSelfCollision(head) {
    for (var i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function gameLoop() {
    var head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Check wall or self collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkSelfCollision(head)) {
        alert("Game Over!");
        snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
        dx = gridSize;
        dy = 0;
        return;
    }
    
    snake.unshift(head);
    if (head.x === foodX && head.y === foodY) {
        randomFood();
    } else {
        snake.pop();
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, gridSize, gridSize);

    ctx.fillStyle = 'lightgreen';
    snake.forEach(function(part) {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
}
setInterval(gameLoop, 150);