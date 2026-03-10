var gameActive = false;
var score = 0;
var highScore = 0;
var level = 1;
var activeBlockWidth = 200;
var colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'];
var audioCtx = null;
var dropping = false;

function resetGame() {
    score = 0;
    level = 1;
    gameActive = true;
    document.getElementById('score').innerText = score;
}

function getCurrentLeft() {
    var craneBlock = document.getElementById('crane-block');
    var computed = window.getComputedStyle(craneBlock);
    return parseFloat(computed.left) || 0;
}

function updateSwingMax() {
    var craneBlock = document.getElementById('crane-block');
    craneBlock.style.setProperty('--swing-max', (320 - activeBlockWidth) + 'px');
    craneBlock.style.width = activeBlockWidth + 'px';
    var color = colors[Math.floor(Math.random() * colors.length)];
    craneBlock.style.backgroundColor = color;
}

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function dropBlock() {
    if (!gameActive || dropping) return;
    dropping = true;
}
