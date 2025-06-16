var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var gameActive = true;

var cells = document.querySelectorAll('.cell');
cells.forEach(function(cell) {
    cell.addEventListener('click', function() {
        if (!gameActive) return;
        var index = parseInt(cell.getAttribute('data-index'));
        
        // BUG: overwrites cell without checking state
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
    });
});