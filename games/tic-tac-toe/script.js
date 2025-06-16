var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var gameActive = true;

var cells = document.querySelectorAll('.cell');
cells.forEach(function(cell) {
    cell.addEventListener('click', function() {
        if (!gameActive) return;
        var index = parseInt(cell.getAttribute('data-index'));
        
        // validation check to prevent overwriting
        if (board[index] !== "") return;
        
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
    });
});