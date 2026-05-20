var gameActive = false;
var score = 0;
var highScore = parseInt(localStorage.getItem('block_high_score')) || 0;
var activeBlockWidth = 200;
var colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'];
var currentColor = colors[0];
var audioCtx = null;
var dropping = false;
var stack = [];

var craneBlock = document.getElementById('crane-block');
var craneLine = document.getElementById('crane-line');
var towerContainer = document.getElementById('tower-container');
var actionBtn = document.getElementById('action-btn');
var scoreEl = document.getElementById('score');
var highScoreEl = document.getElementById('high-score');
var finalScoreEl = document.getElementById('final-score');
var gameOverModal = document.getElementById('game-over-modal');
var restartBtn = document.getElementById('restart-btn');

highScoreEl.innerText = highScore;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playSuccessBeep() {
    try {
        var ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 300 + score * 25;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
}

function playGameOverBuzz() {
    try {
        var ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 110;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch(e) {}
}

function resetGame() {
    score = 0;
    activeBlockWidth = 200;
    dropping = false;
    stack = [{left: 40, width: 240}];
    gameActive = true;
    
    scoreEl.innerText = score;
    gameOverModal.classList.add('hidden');
    
    // Clear old stacked blocks
    var oldBlocks = document.querySelectorAll('.stacked-block, .falling-block');
    oldBlocks.forEach(function(b) { b.remove(); });
    
    // Reset camera scroll
    towerContainer.style.transform = 'translateY(0px)';
    
    actionBtn.innerText = "Drop Block";
    
    spawnNewSwinger();
}

function spawnNewSwinger() {
    if (!gameActive) return;
    
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    
    craneBlock.style.animation = 'none';
    void craneBlock.offsetWidth; // trigger reflow
    
    craneBlock.style.width = activeBlockWidth + 'px';
    craneBlock.style.backgroundColor = currentColor;
    craneBlock.style.display = 'block';
    craneLine.style.display = 'block';
    
    var swingMax = 320 - activeBlockWidth;
    craneBlock.style.setProperty('--swing-max', swingMax + 'px');
    
    // dynamic speed acceleration
    var duration = Math.max(0.6, 2.0 - score * 0.08);
    craneBlock.style.animation = 'swing ' + duration + 's ease-in-out infinite alternate';
    
    dropping = false;
}

function getCurrentLeft() {
    var computed = window.getComputedStyle(craneBlock);
    return parseFloat(computed.left) || 0;
}

function spawnSlice(left, width, color) {
    if (width <= 0) return;
    var slice = document.createElement('div');
    slice.className = 'falling-block';
    slice.style.left = left + 'px';
    slice.style.width = width + 'px';
    slice.style.backgroundColor = color;
    slice.style.bottom = (stack.length * 35) + 'px';
    towerContainer.appendChild(slice);
    setTimeout(function() {
        slice.remove();
    }, 800);
}

function dropBlock() {
    if (!gameActive || dropping) return;
    dropping = true;
    
    // Get absolute current position during animation swing
    var droppedLeft = getCurrentLeft();
    
    // Stop swing visual
    craneBlock.style.animation = 'none';
    craneBlock.style.left = droppedLeft + 'px';
    
    var prevBlock = stack[stack.length - 1];
    var overlapLeft = Math.max(droppedLeft, prevBlock.left);
    var overlapRight = Math.min(droppedLeft + activeBlockWidth, prevBlock.left + prevBlock.width);
    var overlapWidth = overlapRight - overlapLeft;
    
    // Snapping help for junior devs
    if (Math.abs(droppedLeft - prevBlock.left) < 6) {
        overlapLeft = prevBlock.left;
        overlapWidth = prevBlock.width;
        droppedLeft = prevBlock.left;
    }
    
    // Calculate vertical dropping positions
    var stackTopY = (stack.length - 1) * 35 + 25; // height of stack top
    var targetBottom = stack.length * 35 + 25;
    
    var cameraOffset = Math.max(0, (stack.length - 4) * 35);
    var dropStartY = 305 + cameraOffset; // relative bottom height corresponding to crane top position
    
    // Create new falling stack block element
    var blockEl = document.createElement('div');
    blockEl.className = 'stacked-block';
    blockEl.style.left = droppedLeft + 'px';
    blockEl.style.width = activeBlockWidth + 'px';
    blockEl.style.backgroundColor = currentColor;
    blockEl.style.bottom = dropStartY + 'px';
    towerContainer.appendChild(blockEl);
    
    // Animate falling drop transition
    setTimeout(function() {
        blockEl.style.bottom = targetBottom + 'px';
    }, 10);
    
    // Once visual drop ends (150ms) calculate stack validity
    setTimeout(function() {
        craneBlock.style.display = 'none';
        craneLine.style.display = 'none';
        
        if (overlapWidth <= 0) {
            // complete miss!
            blockEl.className = 'falling-block';
            playGameOverBuzz();
            triggerGameOver();
        } else {
            // Successful stacking!
            playSuccessBeep();
            
            // Adjust stacked block properties to actual overlap width and position
            blockEl.style.left = overlapLeft + 'px';
            blockEl.style.width = overlapWidth + 'px';
            
            // Spawn flying slice if there is overhang
            var slicedLeft = 0;
            var slicedWidth = 0;
            if (droppedLeft < prevBlock.left) {
                slicedLeft = droppedLeft;
                slicedWidth = prevBlock.left - droppedLeft;
            } else if (droppedLeft + activeBlockWidth > prevBlock.left + prevBlock.width) {
                slicedLeft = prevBlock.left + prevBlock.width;
                slicedWidth = (droppedLeft + activeBlockWidth) - (prevBlock.left + prevBlock.width);
            }
            
            if (slicedWidth > 0) {
                spawnSlice(slicedLeft, slicedWidth, currentColor);
            }
            
            // Register block in memory
            stack.push({
                left: overlapLeft,
                width: overlapWidth
            });
            
            activeBlockWidth = overlapWidth;
            score++;
            scoreEl.innerText = score;
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('block_high_score', highScore);
                highScoreEl.innerText = highScore;
            }
            
            // Shift camera view downward
            var offset = Math.max(0, (stack.length - 4) * 35);
            towerContainer.style.transform = 'translateY(-' + offset + 'px)';
            
            // Continue stacking
            setTimeout(spawnNewSwinger, 400);
        }
    }, 150);
}

function triggerGameOver() {
    gameActive = false;
    finalScoreEl.innerText = score;
    gameOverModal.classList.remove('hidden');
}

actionBtn.addEventListener('click', function() {
    if (!gameActive) {
        resetGame();
    } else {
        dropBlock();
    }
});

restartBtn.addEventListener('click', resetGame);

window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameActive) dropBlock();
    }
});
