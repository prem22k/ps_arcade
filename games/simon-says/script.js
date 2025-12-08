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

function lightUp(color) {
    var panel = document.querySelector('.panel.' + color);
    panel.classList.add('active');
    playBeep(color);
    setTimeout(function() {
        panel.classList.remove('active');
    }, 250);
}

function nextLevel() {
    userSequence = [];
    level++;
    var colors = ['green', 'red', 'yellow', 'blue'];
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    playSequence();
}