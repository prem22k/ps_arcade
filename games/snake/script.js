var canvas = document.getElementById('snake-canvas');
var ctx = canvas.getContext('2d');
var gridSize = 20;

// Initialize snake
var snake = [
    {x: 160, y: 200},
    {x: 140, y: 200},
    {x: 120, y: 200}
];