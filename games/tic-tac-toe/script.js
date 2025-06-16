// board setup
var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var gameActive = true;

var cells = document.querySelectorAll('.cell');
cells.forEach(function(cell) {
    cell.addEventListener('click', function() {
        console.log('cell clicked event');
    });
});