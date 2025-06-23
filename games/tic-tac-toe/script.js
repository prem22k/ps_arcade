var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var gameActive = true;

var cells = document.querySelectorAll('.cell');
var turnIndicator = document.getElementById('player-turn');

// define win conditions
var winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

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