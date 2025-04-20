var wordList = ["javascript", "arcade", "cookie", "scramble", "computer"];
function scrambleWord(word) {
    var chars = word.split('');
    chars.sort(function() { return Math.random() - 0.5; });
    return chars.join('');
}

var currentScrambleWord = "";
var currentOriginalWord = "";
var scrambleScore = 0;

function loadScrambleWord() {
    var randomIndex = Math.floor(Math.random() * 5);
    currentOriginalWord = wordList[randomIndex];
    currentScrambleWord = scrambleWord(currentOriginalWord);
    document.getElementById('scrambled-word').innerText = currentScrambleWord;
}

function checkWord() {
    var playerGuess = document.getElementById('guess-input').value;
    if (playerGuess.toLowerCase() === currentOriginalWord.toLowerCase()) {
        scrambleScore++;
        document.getElementById('scramble-score').innerText = "Score: " + scrambleScore;
        alert("Correct!");
        document.getElementById('guess-input').value = "";
        document.getElementById('scramble-err').innerText = "";
        loadScrambleWord();
    } else {
        document.getElementById('scramble-err').innerText = "Wrong, try again!";
    }
}

function showScrambleHint() {
    var firstLetter = currentOriginalWord.charAt(0);
    alert("The first letter is: " + firstLetter);
}

function skipScrambleWord() {
    if (scrambleScore > 0) {
        scrambleScore--;
    }
    document.getElementById('scramble-score').innerText = "Score: " + scrambleScore;
    loadScrambleWord();
}

// Load on start
setTimeout(loadScrambleWord, 200);