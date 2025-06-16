var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var gameActive = true;

var cells = document.querySelectorAll('.cell');
var turnIndicator = document.getElementById('player-turn');

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