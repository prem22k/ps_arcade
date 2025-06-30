var holes = document.querySelectorAll('.hole');
var scoreDisplay = document.getElementById('score-display');
var score = 0;
var timeLeft = 30;
var lastHoleIndex = -1;
var gameInterval = null;
var countdownInterval = null;
var gameActive = false;
var moleClicked = false;

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
    moleClicked = false;
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
    var timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.innerText = "Time: " + timeLeft + "s";
    }
    
    showMole();
    gameInterval = setInterval(showMole, 1000);
    
    countdownInterval = setInterval(function() {
        timeLeft--;
        var timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
            timeDisplay.innerText = "Time: " + timeLeft + "s";
        }
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
        if (!gameActive) return; // game status check
        if (hole.classList.contains('active')) {
            if (moleClicked) return;
            score++;
            scoreDisplay.innerText = "Score: " + score;
            moleClicked = true;
            hole.classList.remove('active');
        }
    });
});