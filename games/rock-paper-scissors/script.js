// Step 10: feat: implement Web Audio real-time tone synthesis click and win sweeps
// Premium Cyberpunk Rock-Paper-Scissors Engine
// Encapsulates non-blocking status logs, dynamic DOM updates, Web Audio synthesizers and high-score registry hookups.

class CyberRPS {
    constructor() {
        this.userScore = 0;
        this.compScore = 0;
        this.consecutiveWins = 0;
        this.highScore = 0;
        this.pilotName = "PILOT_D01";
        
        // Audio Context setup
        this.audioCtx = null;
        
        // DOM binding
        this.pilotEl = document.getElementById('pilot-name');
        this.streakEl = document.getElementById('live-streak');
        this.scoreEl = document.getElementById('live-score');
        this.recordEl = document.getElementById('high-score');
        this.playerVis = document.getElementById('player-visualizer');
        this.cpuVis = document.getElementById('cpu-visualizer');
        this.statusMsg = document.getElementById('sys-status');
        
        this.symbols = {
            'rock': '✊',
            'paper': '📄',
            'scissors': '✂️'
        };

        this.init();
    }

    init() {
        // Safe registry check for pilotName
        const storedName = localStorage.getItem('pilotName');
        if (storedName) {
            this.pilotName = storedName;
        } else {
            this.pilotName = "PILOT_" + Math.floor(100 + Math.random() * 900);
            localStorage.setItem('pilotName', this.pilotName);
        }
        this.pilotEl.innerText = this.pilotName;

        // Load unified score from registry matrix
        this.loadHighScore();
        this.updateHUD();
    }

    loadHighScore() {
        try {
            const stored = localStorage.getItem('score_rps');
            if (stored) {
                this.highScore = parseInt(stored, 10) || 0;
            } else {
                this.highScore = 0;
            }
        } catch (e) {
            console.error('[STORAGE_ERROR] Score read failure:', e);
            this.highScore = 0;
        }
    }

    saveHighScore() {
        try {
            if (this.userScore > this.highScore) {
                this.highScore = this.userScore;
                localStorage.setItem('score_rps', this.highScore);
            }
        } catch (e) {
            console.warn('[STORAGE_WARNING] High score write failure:', e);
        }
    }

    initAudio() {
        if (this.audioCtx) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('[AUDIO_WARNING] Synth context failure:', e);
        }
    }

    playTone(type = 'click') {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.1);
                
                gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.1);
            } else if (type === 'win') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3);
                
                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
            } else if (type === 'lose') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(70, this.audioCtx.currentTime + 0.4);
                
                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.45);
            } else if (type === 'tie') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(330, this.audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(220, this.audioCtx.currentTime + 0.2);
                
                gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.25);
            }
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.5);
        } catch (e) {
            // silent fail
        }
    }

    playRound(choice) {
        this.playTone('click');
        
        // Random computer selection
        const choices = ['rock', 'paper', 'scissors'];
        const compChoice = choices[Math.floor(Math.random() * 3)];
        
        // Reset dynamic visual states
        this.playerVis.className = "choice-visualizer";
        this.cpuVis.className = "choice-visualizer";
        
        this.playerVis.innerHTML = "...";
        this.cpuVis.innerHTML = "...";
        
        this.statusMsg.innerText = "[SYS_CALC: TRANSMITTING VECTOR DECISION...]";

        setTimeout(() => {
            // Set choice states
            this.playerVis.className = `choice-visualizer active-${choice}`;
            this.playerVis.innerHTML = `<span class="visualizer-symbol">${this.symbols[choice]}</span><span>${choice.toUpperCase()}</span>`;
            
            this.cpuVis.className = `choice-visualizer active-${compChoice}`;
            this.cpuVis.innerHTML = `<span class="visualizer-symbol">${this.symbols[compChoice]}</span><span>${compChoice.toUpperCase()}</span>`;
            
            let result = "";
            if (choice === compChoice) {
                result = "TIE";
                this.consecutiveWins = 0;
                this.playTone('tie');
                this.statusMsg.innerText = `[ROUND_TIE] // SYMMETRICAL SELECTION DETECTED`;
            } else if (
                (choice === 'rock' && compChoice === 'scissors') ||
                (choice === 'paper' && compChoice === 'rock') ||
                (choice === 'scissors' && compChoice === 'paper')
            ) {
                result = "WIN";
                this.userScore++;
                this.consecutiveWins++;
                this.playTone('win');
                this.statusMsg.innerText = `[ROUND_WIN] // PILOT VECTOR OVERRIDDEN SYSTEM MODULE`;
            } else {
                result = "LOSE";
                this.compScore++;
                this.consecutiveWins = 0;
                this.playTone('lose');
                this.statusMsg.innerText = `[ROUND_LOSS] // SYSTEM VECTOR BYPASSED SHIELDS`;
            }
            
            this.saveHighScore();
            this.updateHUD();
        }, 350);
    }

    reset() {
        this.playTone('click');
        this.userScore = 0;
        this.compScore = 0;
        this.consecutiveWins = 0;
        this.playerVis.className = "choice-visualizer";
        this.cpuVis.className = "choice-visualizer";
        this.playerVis.innerHTML = "READY";
        this.cpuVis.innerHTML = "READY";
        this.statusMsg.innerText = "[SYS_STATUS: REBOOTED] // DECK CHARGES RESTORED";
        this.updateHUD();
    }

    updateHUD() {
        this.scoreEl.innerText = this.userScore;
        this.streakEl.innerText = this.consecutiveWins;
        this.recordEl.innerText = this.highScore;
    }
}

// Instantiate engine when DOM is active
document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new CyberRPS();
});

// Exposed global functions for legacy index.html buttons
function selectCard(choice) {
    if (window.gameEngine) {
        window.gameEngine.playRound(choice);
    }
}

// Support original button onClick naming just in case
function play(choice) {
    selectCard(choice);
}

function resetGame() {
    if (window.gameEngine) {
        window.gameEngine.reset();
    }
}
