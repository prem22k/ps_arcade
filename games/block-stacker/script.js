var gameActive = false;
var score = 0;
var highScore = 0;
var level = 1;

function resetGame() {
    score = 0;
    level = 1;
    gameActive = true;
    document.getElementById('score').innerText = score;
}
