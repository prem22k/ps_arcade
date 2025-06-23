var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var gameActive = true;

var cells = document.querySelectorAll('.cell');
var turnIndicator = document.getElementById('player-turn');

var winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWin() {
    for (var i = 0; i < winConditions.length; i++) {
        var cond = winConditions[i];
        if (board[cond[0]] !== "" && board[cond[0]] === board[cond[1]] && board[cond[0]] === board[cond[2]]) {
            return true;
        }
    }
    return false;
}

function checkTie() {
    return board.every(function(cell) {
        return cell !== "";
    });
}

// reset board function
function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    turnIndicator.innerText = "Player X's Turn";
    cells.forEach(function(cell) {
        cell.innerText = "";
    });
    alert("Board reset!");
}

cells.forEach(function(cell) {
    cell.addEventListener('click', function() {
        if (!gameActive) return;
        var index = parseInt(cell.getAttribute('data-index'));
        
        if (board[index] !== "") return;
        
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        
        if (checkWin()) {
            alert("Player " + currentPlayer + " wins!");
            turnIndicator.innerText = "Player " + currentPlayer + " Wins!";
            gameActive = false;
            return;
        }
        
        // tie logic and UI updates
        if (checkTie()) {
            alert("It's a tie!");
            turnIndicator.innerText = "It's a tie!";
            gameActive = false;
            return;
        }
        
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
        turnIndicator.innerText = "Player " + currentPlayer + "'s Turn";
    });
});