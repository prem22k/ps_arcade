var globalTarget = Math.floor(Math.random() * 100) + 1;
function resetGuessTarget() {
    globalTarget = Math.floor(Math.random() * 100) + 1;
    alert("new target generated!");
}

function submitGuess() {
    var userGuess = document.getElementById('user-guess-input').value;
    var guess = parseInt(userGuess);
    document.getElementById('last-guess').innerText = "Last Guess: " + guess;
    if (guess > globalTarget) {
        alert("Too high!");
    } else if (guess < globalTarget) {
        alert("Too low!");
    } else if (guess == globalTarget) {
        alert("you win!");
        document.getElementById('guess-game').style.backgroundColor = 'lightgreen';
    }
}