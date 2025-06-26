var holes = document.querySelectorAll('.hole');
var lastHoleIndex = -1;

function randomHole() {
    var index = Math.floor(Math.random() * holes.length);
    while (index === lastHoleIndex) {
        index = Math.floor(Math.random() * holes.length);
    }
    lastHoleIndex = index;
    return holes[index];
}

function showMole() {
    holes.forEach(function(hole) {
        hole.classList.remove('active');
    });
    var activeHole = randomHole();
    activeHole.classList.add('active');
}