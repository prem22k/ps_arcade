var holes = document.querySelectorAll('.hole');
var scoreDisplay = document.getElementById('score-display');
var score = 0;
var timeLeft = 30;
var lastHoleIndex = -1;
var gameInterval = null;
var countdownInterval = null;
var gameActive = false;

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
    clearInterval(countdownInterval);
    score = 0;
    timeLeft = 30;
    gameActive = true;
    scoreDisplay.innerText = "Score: " + score;
    
    showMole();
    gameInterval = setInterval(showMole, 1000);
    
    countdownInterval = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    gameActive = false;
    holes.forEach(function(hole) {
        hole.classList.remove('active');
    });
    alert("Game over! Your final score is: " + score);
}

function stopGame() {
    endGame();
    alert("Game stopped.");
}

holes.forEach(function(hole) {
    hole.addEventListener('click', function() {
        if (hole.classList.contains('active')) {
            score++;
            scoreDisplay.innerText = "Score: " + score;
            hole.classList.remove('active');
        }
    });
});