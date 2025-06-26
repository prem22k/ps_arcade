var holes = document.querySelectorAll('.hole');
var scoreDisplay = document.getElementById('score-display');
var score = 0;
var lastHoleIndex = -1;
var gameInterval = null;

function randomHole() {
    var index = Math.floor(Math.random() * holes.length);
    while (index === lastHoleIndex) {
        index = Math.floor(Math.random() * holes.length);
    }
    lastHoleIndex = index;
    return holes[index];
}

function showMole() {
    holes.forEach(function(hole) {
        hole.classList.remove('active');
    });
    var activeHole = randomHole();
    activeHole.classList.add('active');
}

function startGame() {
    clearInterval(gameInterval);
    score = 0;
    scoreDisplay.innerText = "Score: " + score;
    showMole();
    gameInterval = setInterval(showMole, 1000);
}