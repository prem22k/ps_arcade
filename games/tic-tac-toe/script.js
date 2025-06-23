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

// loop check for win conditions
function checkWin() {
    for (var i = 0; i < winConditions.length; i++) {
        var cond = winConditions[i];
        if (board[cond[0]] !== "" && board[cond[0]] === board[cond[1]] && board[cond[0]] === board[cond[2]]) {
            return true;
        }
    }
    return false;
}

cells.forEach(function(cell) {
    cell.addEventListener('click', function() {
        if (!gameActive) return;
        var index = parseInt(cell.getAttribute('data-index'));
        
        if (board[index] !== "") return;
        
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
        turnIndicator.innerText = "Player " + currentPlayer + "'s Turn";
    });
});