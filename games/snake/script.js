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

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    snake.pop();
    
    drawFood();

    ctx.fillStyle = 'lightgreen';
    snake.forEach(function(part) {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
}
setInterval(gameLoop, 150);