var userScore = 0;
var compScore = 0;
var userName = window.prompt("Enter your name:", "Player");
if (!userName) userName = "Player";
document.getElementById('welcome').innerText = "welcome " + userName + "!";
updateScoreText();

function play(choice) {
    var choices = ['rock', 'paper', 'scissors'];
    var compChoice = choices[Math.floor(Math.random() * 3)];
    
    var result = "";
    if (choice === compChoice) {
        result = "tie";
        document.getElementById('score').style.color = "orange";
    } else if (
        (choice === 'rock' && compChoice === 'scissors') ||
        (choice === 'paper' && compChoice === 'rock') ||
        (choice === 'scissors' && compChoice === 'paper')
    ) {
        result = "win";
        userScore++;
        document.getElementById('score').style.color = "green";
    } else {
        result = "lose";
        compScore++;
        document.getElementById('score').style.color = "red";
    }
    
    updateScoreText();
    alert('you chose ' + choice + ', computer chose ' + compChoice + '.\nresult: you ' + result + '!');
}

function resetGame() {
    userScore = 0;
    compScore = 0;
    document.getElementById('score').style.color = "black";
    updateScoreText();
    alert('scores reset!');
}

function updateScoreText() {
    document.getElementById('score').innerText = "Score: " + userName + " " + userScore + " - " + compScore + " Computer";
}