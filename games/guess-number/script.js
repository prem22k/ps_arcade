var globalTarget = Math.floor(Math.random() * 100) + 1;
function resetGuessTarget() {
    globalTarget = Math.floor(Math.random() * 100) + 1;
    alert("new target generated!");
}

function startGuessGame() {
    document.getElementById('guess-game').style.backgroundColor = 'yellow';
    var target = globalTarget;
    var guess = -1;
    var attempts = 0;
    while (guess != target) {
        var userGuess = window.prompt("Guess 1-100:");
        if (userGuess === null) {
            alert("Game exited.");
            break;
        }
        guess = parseInt(userGuess);
        if (isNaN(guess)) {
            alert("Please enter a valid number!");
            continue;
        }
        attempts++;
        document.getElementById('last-guess').innerText = "Last Guess: " + guess;
        if (guess > target) {
            alert("Too high!");
        } else if (guess < target) {
            alert("Too low!");
        }
    }
    if (guess == target) {
        alert("you win! it took you " + attempts + " attempts.");
    }
}