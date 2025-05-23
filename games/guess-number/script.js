var globalTarget = Math.floor(Math.random() * 100) + 1;
var attempts = 0;

function resetGuessTarget() {
    globalTarget = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('guess-game').style.backgroundColor = 'yellow';
    document.getElementById('last-guess').innerText = "Last Guess: None";
    document.getElementById('guess-attempts').innerText = "Attempts: 0";
    var feedbackEl = document.getElementById('guess-feedback');
    feedbackEl.innerText = "New target generated!";
    feedbackEl.style.color = "blue";
}

function submitGuess() {
    var userGuess = document.getElementById('user-guess-input').value;
    if (userGuess === "") {
        alert("Please enter a number!");
        return;
    }
    var guess = parseInt(userGuess);
    if (isNaN(guess)) {
        alert("Please enter a valid number!");
        return;
    }
    attempts++;
    document.getElementById('last-guess').innerText = "Last Guess: " + guess;
    document.getElementById('guess-attempts').innerText = "Attempts: " + attempts;
    
    var feedbackEl = document.getElementById('guess-feedback');
    if (guess > globalTarget) {
        feedbackEl.innerText = "Too high!";
        feedbackEl.style.color = "red";
    } else if (guess < globalTarget) {
        feedbackEl.innerText = "Too low!";
        feedbackEl.style.color = "orange";
    } else if (guess == globalTarget) {
        feedbackEl.innerText = "You win! The number was " + globalTarget;
        feedbackEl.style.color = "green";
        alert("you win! it took you " + attempts + " attempts.");
        document.getElementById('guess-game').style.backgroundColor = 'lightgreen';
    }
}