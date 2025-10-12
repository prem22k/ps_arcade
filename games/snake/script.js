var canvas = document.getElementById('snake-canvas');
var ctx = canvas.getContext('2d');
var gridSize = 20;

var snake = [
    {x: 160, y: 200},
    {x: 140, y: 200},
    {x: 120, y: 200}
];

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = 'lightgreen';
    snake.forEach(function(part) {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
}
setInterval(gameLoop, 150);