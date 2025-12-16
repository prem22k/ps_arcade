var audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

var freqs = {
    green: 261.63,
    red: 329.63,
    yellow: 392.00,
    blue: 523.25
};

var sequence = [];
var userSequence = [];
var level = 0;
var gameActive = false;
var playingSequence = false;
var statusIndicator = document.getElementById('status-indicator');
var startBtn = document.getElementById('start-btn');

function playBeep(color) {
    var ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freqs[color];
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
}

function playGameOverBeep() {
    var ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 120.00;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
}

function lightUp(color) {
    var panel = document.querySelector('.panel.' + color);
    panel.classList.add('active');
    playBeep(color);
    setTimeout(function() {
        panel.classList.remove('active');
    }, 250);
}

function playSequence() {
    playingSequence = true;
    var i = 0;
    var interval = setInterval(function() {
        lightUp(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            playingSequence = false;
        }
    }, 600);
}

function nextLevel() {
    userSequence = [];
    level++;
    statusIndicator.innerText = "Level: " + level;
    var colors = ['green', 'red', 'yellow', 'blue'];
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    playSequence();
}

function startGame() {
    var ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    sequence = [];
    level = 0;
    gameActive = true;
    nextLevel();
}

startBtn.addEventListener('click', startGame);

function checkUserSequence(index) {
    if (userSequence[index] !== sequence[index]) {
        playGameOverBeep();
        statusIndicator.innerText = "Game Over! Score: " + (level - 1);
        sequence = [];
        level = 0;
        gameActive = false;
        return;
    }
    if (userSequence.length === sequence.length) {
        setTimeout(nextLevel, 1000);
    }
}

document.querySelectorAll('.panel').forEach(function(panel) {
    panel.addEventListener('click', function() {
        if (!gameActive || playingSequence) return;
        var color = panel.getAttribute('data-color');
        lightUp(color);
        userSequence.push(color);
        checkUserSequence(userSequence.length - 1);
    });
});