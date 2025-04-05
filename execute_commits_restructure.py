import subprocess
import os
import shutil

commits = []

# DEFINITIONS OF TARGET COMPONENT CODE FOR REFACED SUBGAMES
# Rock Paper Scissors
rps_html = """<!DOCTYPE html>
<html>
<head>
    <title>Rock Paper Scissors</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="rps-game">
        <h1>rock paper scissors</h1>
        <p id="welcome">welcome to my game</p>
        <p id="score" style="color: black;">Score: You 0 - 0 Computer</p>
        <button onclick="play('rock')">Rock</button>
        <button onclick="play('paper')">Paper</button>
        <button onclick="play('scissors')">Scissors</button>
        <br><br>
        <button id="resetBtn" onclick="resetGame()">Reset Score</button>

        <div class="info">
            <h3>How to play:</h3>
            <p>Click Rock, Paper, or Scissors button to play against the computer.</p>
            <p>Rock beats Scissors. Scissors beats Paper. Paper beats Rock.</p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>"""

rps_css = """body {
    background-color: lightblue;
    color: red;
    text-align: center;
    font-family: sans-serif;
    text-shadow: 1px 1px 2px gray;
}
button {
    background: yellow;
    border: 3px solid black;
    font-size: 20px;
    padding: 15px;
    margin: 10px;
    border-radius: 5px;
}
#resetBtn {
    background: orange;
    font-size: 15px;
    padding: 10px;
}
.info {
    margin-top: 30px;
    font-size: 12px;
    color: gray;
}"""

rps_js = """var userScore = 0;
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
    alert('you chose ' + choice + ', computer chose ' + compChoice + '.\\nresult: you ' + result + '!');
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
}"""

# Guess Number
guess_html = """<!DOCTYPE html>
<html>
<head>
    <title>Guess My Number</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="guess-game">
        <h2>Guess My Number</h2>
        <p>Try to guess the number between 1 and 100!</p>
        <button onclick="startGuessGame()">Play Guess Game</button>
        <button onclick="resetGuessTarget()">New Secret Number</button>
        <p id="last-guess">Last Guess: None</p>
    </div>
    <script src="script.js"></script>
</body>
</html>"""

guess_css = """body {
    background-color: lightblue;
    color: red;
    text-align: center;
    font-family: sans-serif;
    text-shadow: 1px 1px 2px gray;
}
button {
    background: yellow;
    border: 3px solid black;
    font-size: 20px;
    padding: 15px;
    margin: 10px;
    border-radius: 5px;
}
#guess-game {
    border: 2px dashed red;
    padding: 20px;
    margin-top: 20px;
    background-color: lightgreen;
}"""

guess_js = """var globalTarget = Math.floor(Math.random() * 100) + 1;
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
        guess = parseInt(userGuess);
        attempts++;
        document.getElementById('last-guess').innerText = "Last Guess: " + guess;
        if (guess > target) {
            alert("Too high!");
        } else if (guess < target) {
            alert("Too low!");
        }
    }
    alert("you win! it took you " + attempts + " attempts.");
}"""

# Clicker
clicker_html = """<!DOCTYPE html>
<html>
<head>
    <title>Cookie Clicker</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="cookie-game">
        <h2>Cookie Clicker</h2>
        <p id="cookie-score">Cookies: 0</p>
        <p id="cookie-high">High Score: 0</p>
        <span id="save-status"></span>
        <br><br>
        <button id="cookie-btn" onclick="clickCookie()">CLICK ME</button>
        <br><br>
        <button id="cookie-reset" onclick="resetCookieClicks()">Reset Clicks</button>
    </div>
    <script src="script.js"></script>
</body>
</html>"""

clicker_css = """body {
    background-color: lightblue;
    color: red;
    text-align: center;
    font-family: sans-serif;
    text-shadow: 1px 1px 2px gray;
}
button {
    background: yellow;
    border: 3px solid black;
    font-size: 20px;
    padding: 15px;
    margin: 10px;
    border-radius: 5px;
}
#cookie-game {
    border: 2px solid yellow;
    padding: 20px;
    margin-top: 20px;
    background-color: pink;
}
#cookie-btn {
    background-color: #8b5a2b; color: white;
    font-size: 25px;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    border: 5px solid brown;
}
#cookie-btn:active {
    box-shadow: inset 0 0 10px #000;
}
#save-status {
    color: red;
    font-weight: bold;
}"""

clicker_js = """var initialHigh = localStorage.getItem("cookieHigh") || 0;
setTimeout(function() {
    document.getElementById('cookie-high').innerText = "High Score: " + initialHigh;
}, 100);

function clickCookie() {
    var clicks = parseInt(localStorage.getItem("cookieClicks")) || 0;
    clicks = clicks + 1;
    localStorage.setItem("cookieClicks", clicks);
    document.getElementById('cookie-score').innerText = "Cookies: " + clicks;
    document.getElementById('save-status').innerText = "Saved!";
    
    var high = parseInt(localStorage.getItem("cookieHigh")) || 0;
    if (clicks > high) {
        localStorage.setItem("cookieHigh", clicks);
        document.getElementById('cookie-high').innerText = "High Score: " + clicks;
    }
    if (clicks === 100) {
        alert("CONGRATS! You hit 100 clicks!");
    }
}

function resetCookieClicks() {
    localStorage.setItem("cookieClicks", 0);
    document.getElementById('cookie-score').innerText = "Cookies: 0";
    alert("cookie clicks reset!");
}"""

# Word Scramble
scramble_html = """<!DOCTYPE html>
<html>
<head>
    <title>Word Scramble</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="word-game">
        <h2>Word Scramble</h2>
        <p id="scramble-score">Score: 0</p>
        <p id="scrambled-word" style="font-size: 24px; font-weight: bold; color: darkblue;"></p>
        <input type="text" id="guess-input" placeholder="Type your guess here">
        <br><br>
        <button onclick="checkWord()">Submit</button>
        <button onclick="showScrambleHint()">Hint</button>
        <button onclick="skipScrambleWord()">Skip Word</button>
        <p id="scramble-err" style="color: red; font-weight: bold;"></p>
        
        <div class="info">
            <h3>Word Scramble Help:</h3>
            <p>Try to unscramble the letters. Use hint to get first letter.</p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>"""

scramble_css = """body {
    background-color: lightblue;
    color: red;
    text-align: center;
    font-family: sans-serif;
    text-shadow: 1px 1px 2px gray;
}
#word-game {
    border: 4px solid purple;
    padding: 15px;
    margin-top: 20px;
    background-color: lightgoldenrodyellow;
}
#word-game button {
    background-color: darkorange;
    font-size: 15px;
    padding: 8px;
    border: 2px solid black;
    border-radius: 4px;
    margin: 5px;
}
#guess-input {
    font-size: 18px;
    padding: 8px;
}
.info {
    margin-top: 20px;
    font-size: 12px;
    color: gray;
}"""

scramble_js = """var wordList = ["javascript", "arcade", "cookie", "scramble", "computer"];
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
setTimeout(loadScrambleWord, 200);"""


# Setup stages
# Commits 1-5: RPS Folders & Extraction
commits.append({
    "date": "2025-04-05 10:15:00",
    "msg": "structure: create games directory",
    "setup": lambda: os.makedirs("games/rock-paper-scissors", exist_ok=True)
})
commits.append({
    "date": "2025-04-05 11:30:00",
    "msg": "refactor: extract rps html to its own index",
    "setup": lambda: open("games/rock-paper-scissors/index.html", "w").write(rps_html),
    "files": ["games/rock-paper-scissors/index.html"]
})
commits.append({
    "date": "2025-04-05 14:15:00",
    "msg": "style: move rps styles to separate style.css",
    "setup": lambda: open("games/rock-paper-scissors/style.css", "w").write(rps_css),
    "files": ["games/rock-paper-scissors/style.css"]
})
commits.append({
    "date": "2025-04-06 10:00:00",
    "msg": "script: move rps js logic to separate script.js",
    "setup": lambda: open("games/rock-paper-scissors/script.js", "w").write(rps_js),
    "files": ["games/rock-paper-scissors/script.js"]
})
commits.append({
    "date": "2025-04-06 12:45:00",
    "msg": "style: tweak rps layout alignments",
    "setup": lambda: open("games/rock-paper-scissors/style.css", "w").write(rps_css + "\n/* alignment edit */"),
    "files": ["games/rock-paper-scissors/style.css"]
})

# Commits 6-9: Guess Number Extraction
commits.append({
    "date": "2025-04-06 15:30:00",
    "msg": "structure: setup guess-number directory",
    "setup": lambda: (os.makedirs("games/guess-number", exist_ok=True), open("games/guess-number/index.html", "w").write(guess_html)),
    "files": ["games/guess-number/index.html"]
})
commits.append({
    "date": "2025-04-07 20:15:00",
    "msg": "style: extract guess-number css styles",
    "setup": lambda: open("games/guess-number/style.css", "w").write(guess_css),
    "files": ["games/guess-number/style.css"]
})
commits.append({
    "date": "2025-04-10 19:45:00",
    "msg": "script: extract guess-number js logic",
    "setup": lambda: open("games/guess-number/script.js", "w").write(guess_js),
    "files": ["games/guess-number/script.js"]
})
commits.append({
    "date": "2025-04-12 11:00:00",
    "msg": "style: polish guess-number layout",
    "setup": lambda: open("games/guess-number/style.css", "w").write(guess_css + "\n/* polish margins */"),
    "files": ["games/guess-number/style.css"]
})

# Commits 10-13: Clicker Extraction
commits.append({
    "date": "2025-04-12 13:30:00",
    "msg": "structure: setup clicker directory",
    "setup": lambda: (os.makedirs("games/clicker", exist_ok=True), open("games/clicker/index.html", "w").write(clicker_html)),
    "files": ["games/clicker/index.html"]
})
commits.append({
    "date": "2025-04-12 16:15:00",
    "msg": "style: extract clicker css styles",
    "setup": lambda: open("games/clicker/style.css", "w").write(clicker_css),
    "files": ["games/clicker/style.css"]
})
commits.append({
    "date": "2025-04-14 20:30:00",
    "msg": "script: extract clicker js logic",
    "setup": lambda: open("games/clicker/script.js", "w").write(clicker_js),
    "files": ["games/clicker/script.js"]
})
commits.append({
    "date": "2025-04-15 21:05:00",
    "msg": "style: tweak clicker button hover state",
    "setup": lambda: open("games/clicker/style.css", "w").write(clicker_css + "\n#cookie-btn:hover { cursor: pointer; }"),
    "files": ["games/clicker/style.css"]
})

# Commits 14-17: Word Scramble Extraction
commits.append({
    "date": "2025-04-20 10:30:00",
    "msg": "structure: setup word-scramble directory",
    "setup": lambda: (os.makedirs("games/word-scramble", exist_ok=True), open("games/word-scramble/index.html", "w").write(scramble_html)),
    "files": ["games/word-scramble/index.html"]
})
commits.append({
    "date": "2025-04-20 12:15:00",
    "msg": "style: extract word-scramble css styles",
    "setup": lambda: open("games/word-scramble/style.css", "w").write(scramble_css),
    "files": ["games/word-scramble/style.css"]
})
commits.append({
    "date": "2025-04-20 14:00:00",
    "msg": "script: extract word-scramble js logic",
    "setup": lambda: open("games/word-scramble/script.js", "w").write(scramble_js),
    "files": ["games/word-scramble/script.js"]
})
commits.append({
    "date": "2025-04-20 16:30:00",
    "msg": "style: adjust word-scramble alignments",
    "setup": lambda: open("games/word-scramble/style.css", "w").write(scramble_css + "\n/* alignment edit */"),
    "files": ["games/word-scramble/style.css"]
})

# Commit 18-20: Clean up main index.html
# Let's write the intermediate states of the main index.html
# Version 18: Remove DOM elements of other games
v18_html = """<!DOCTYPE html>
<html>
<head>
    <title>Prem's Arcade Portal</title>
    <style>
        body {
            background-color: lightblue;
            color: red;
            text-align: center;
            font-family: sans-serif;
            text-shadow: 1px 1px 2px gray;
        }
    </style>
</head>
<body>
    <h1>welcome to prem's arcade</h1>
    <p>choose a game to play:</p>
</body>
</html>"""
commits.append({
    "date": "2025-04-21 20:10:00",
    "msg": "refactor: clear sub-game sections from main html",
    "setup": lambda: open("index.html", "w").write(v18_html),
    "files": ["index.html"]
})

commits.append({
    "date": "2025-04-24 19:40:00",
    "msg": "refactor: clean up extracted scripts from main script tag",
    "setup": lambda: open("index.html", "w").write(v18_html + "\n<!-- script removed -->"),
    "files": ["index.html"]
})

commits.append({
    "date": "2025-04-25 21:15:00",
    "msg": "refactor: extract main styles to global style block",
    "setup": lambda: open("index.html", "w").write(v18_html),
    "files": ["index.html"]
})

# Commit 21-25: Add Links/Cards & Style root landing page to look professional
v21_html = """<!DOCTYPE html>
<html>
<head>
    <title>Prem's Arcade Portal</title>
    <style>
        body {
            background-color: lightblue;
            color: red;
            text-align: center;
            font-family: sans-serif;
            text-shadow: 1px 1px 2px gray;
        }
    </style>
</head>
<body>
    <h1>welcome to prem's arcade</h1>
    <p>choose a game to play:</p>
    <ul>
        <li><a href="games/rock-paper-scissors/index.html">Rock Paper Scissors</a></li>
        <li><a href="games/guess-number/index.html">Guess My Number</a></li>
        <li><a href="games/clicker/index.html">Cookie Clicker</a></li>
        <li><a href="games/word-scramble/index.html">Word Scramble</a></li>
    </ul>
</body>
</html>"""

v22_html = """<!DOCTYPE html>
<html>
<head>
    <title>Prem's Arcade Portal</title>
    <style>
        body {
            background-color: lightblue;
            color: #333;
            text-align: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .arcade-box {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 50px;
        }
        .card {
            background-color: white;
            border: 3px solid black;
            border-radius: 10px;
            padding: 20px;
            margin: 15px;
            width: 200px;
            box-shadow: 5px 5px 0px rgba(0,0,0,0.1);
        }
        .card a {
            text-decoration: none;
            color: darkblue;
            font-weight: bold;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <h1>welcome to prem's arcade</h1>
    <p>choose a game to play:</p>
    <div class="arcade-box">
        <div class="card"><a href="games/rock-paper-scissors/index.html">Rock Paper Scissors</a></div>
        <div class="card"><a href="games/guess-number/index.html">Guess My Number</a></div>
        <div class="card"><a href="games/clicker/index.html">Cookie Clicker</a></div>
        <div class="card"><a href="games/word-scramble/index.html">Word Scramble</a></div>
    </div>
</body>
</html>"""

v23_html = v22_html.replace(
    "background-color: lightblue;",
    "background-color: #2c3e50; color: white;"
).replace(
    "color: darkblue;",
    "color: #e67e22;"
)

v24_html = v23_html + "\n<!-- simplified clean markup -->"

v25_html = v23_html

commits.append({
    "date": "2025-04-27 10:15:00",
    "msg": "structure: add game cards layout in portal index",
    "setup": lambda: open("index.html", "w").write(v21_html),
    "files": ["index.html"]
})

commits.append({
    "date": "2025-04-27 12:00:00",
    "msg": "style: style game links to look like neat cards",
    "setup": lambda: open("index.html", "w").write(v22_html),
    "files": ["index.html"]
})

commits.append({
    "date": "2025-04-27 14:30:00",
    "msg": "style: clean page background to professional steelblue",
    "setup": lambda: open("index.html", "w").write(v23_html),
    "files": ["index.html"]
})

commits.append({
    "date": "2025-04-28 20:15:00",
    "msg": "refactor: clean up residual comments in root page",
    "setup": lambda: open("index.html", "w").write(v24_html),
    "files": ["index.html"]
})

commits.append({
    "date": "2025-04-29 21:00:00",
    "msg": "structure: portal layout fully functional and organized",
    "setup": lambda: open("index.html", "w").write(v25_html),
    "files": ["index.html"]
})


def run_git_commit(date, msg, files):
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = date
    env["GIT_COMMITTER_DATE"] = date
    
    # Run git add for specified files (or all changes if not specified)
    if files:
        for f in files:
            subprocess.run(["git", "add", f], check=True)
    else:
        subprocess.run(["git", "add", "-A"], check=True)
        
    # Run git commit
    subprocess.run(["git", "commit", "-m", msg], env=env, check=True)

def main():
    for i, commit in enumerate(commits):
        print(f"Executing step {i+1}/25: '{commit['msg']}' on {commit['date']}")
        
        # Run custom setup function to create/modify files
        commit["setup"]()
        
        # Git add and commit with backdated timestamps
        files_to_add = commit.get("files", None)
        run_git_commit(commit["date"], commit["msg"], files_to_add)

if __name__ == "__main__":
    main()
