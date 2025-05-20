var globalTarget = Math.floor(Math.random() * 100) + 1;
var attempts = 0;

function resetGuessTarget() {
    globalTarget = Math.floor(Math.random() * 100) + 1;
    alert("new target generated!");
}

function submitGuess() {
    var userGuess = document.getElementById('user-guess-input').value;
    var guess = parseInt(userGuess);
    attempts++;
    document.getElementById('last-guess').innerText = "Last Guess: " + guess;
    document.getElementById('guess-attempts').innerText = "Attempts: " + attempts;
    if (guess > globalTarget) {
        alert("Too high!");
    } else if (guess < globalTarget) {
        alert("Too low!");
    } else if (guess == globalTarget) {
        alert("you win! it took you " + attempts + " attempts.");
        document.getElementById('guess-game').style.backgroundColor = 'lightgreen';
    }
}