class PasscodeDecrypter {
    constructor() {
        this.targetNum = 0;
        this.attempts = 0;
        this.highScore = 0;
        this.gameActive = true;
        this.audioCtx = null;

        // Search Bounds Tracker
        this.minBound = 1;
        this.maxBound = 100;

        // DOM elements
        this.inputEl = document.getElementById('user-guess-input');
        this.feedbackEl = document.getElementById('decrypt-feedback');
        this.attemptsEl = document.getElementById('guess-attempts');
        this.lastGuessEl = document.getElementById('last-guess');
        this.recordEl = document.getElementById('high-score');
        this.statusEl = document.getElementById('sys-status');
        this.displayPanelEl = document.querySelector('.display-panel');

        // Bounds UI elements
        this.minBoundEl = document.getElementById('bound-min-val');
        this.maxBoundEl = document.getElementById('bound-max-val');
        this.barFillEl = document.getElementById('bounds-bar-fill');

        this.init();
    }

    init() {
        this.loadHighScore();
        this.resetGame();

        // Keyboard binds
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            if (e.key >= '0' && e.key <= '9') {
                this.pressDigit(e.key);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.deleteLastDigit();
            } else if (e.key === 'Enter') {
                this.submitGuess();
            }
        });
    }

    loadHighScore() {
        try {
            const stored = localStorage.getItem('score_guess');
            this.highScore = stored ? parseInt(stored, 10) || 0 : 0;
            this.recordEl.innerText = this.highScore;
        } catch (e) {
            console.error('[STORAGE_ERROR] Score read failure:', e);
            this.highScore = 0;
        }
    }

    saveHighScore(scoreVal) {
        try {
            if (scoreVal > this.highScore) {
                this.highScore = scoreVal;
                localStorage.setItem('score_guess', this.highScore);
                this.recordEl.innerText = this.highScore;
            }
        } catch (e) {
            console.warn('[STORAGE_WARNING] High score write failure:', e);
        }
    }

    updateBoundsUI() {
        if (this.minBoundEl) this.minBoundEl.innerText = this.minBound.toString().padStart(2, '0');
        if (this.maxBoundEl) this.maxBoundEl.innerText = this.maxBound.toString().padStart(2, '0');
        
        if (this.barFillEl) {
            // Percent calculations (1 to 100 track)
            const leftPercent = Math.max(0, this.minBound - 1);
            const widthPercent = Math.max(0, this.maxBound - this.minBound + 1);
            this.barFillEl.style.left = `${leftPercent}%`;
            this.barFillEl.style.width = `${widthPercent}%`;
        }
    }

    resetGame() {
        this.targetNum = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        this.gameActive = true;
        this.inputEl.value = "";
        this.attemptsEl.innerText = "0";
        this.lastGuessEl.innerText = "NONE";
        this.feedbackEl.innerText = "[SYS_STATUS: READY TO DECRYPT]";
        this.feedbackEl.style.color = "var(--neon-cyan)";
        this.feedbackEl.style.textShadow = "var(--shadow-cyan)";
        this.statusEl.innerText = "ONLINE";
        this.statusEl.className = "value cyan-text";
        this.displayPanelEl.style.borderColor = "var(--border-cyan)";
        
        // Reset search bounds
        this.minBound = 1;
        this.maxBound = 100;
        this.updateBoundsUI();

        this.playTone('reset');
    }

    pressDigit(digit) {
        this.playTone('click');
        if (this.inputEl.value.length < 2) {
            this.inputEl.value += digit;
        }
    }

    clearInput() {
        this.playTone('click');
        this.inputEl.value = "";
    }

    deleteLastDigit() {
        this.playTone('click');
        this.inputEl.value = this.inputEl.value.slice(0, -1);
    }

    initAudio() {
        if (this.audioCtx) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('[AUDIO_WARNING] Synth context failure:', e);
        }
    }

    playTone(type) {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);
            } else if (type === 'high') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.25);
            } else if (type === 'low') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(450, this.audioCtx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.25);
            } else if (type === 'win') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(600, this.audioCtx.currentTime + 0.15);
                osc.frequency.linearRampToValueAtTime(900, this.audioCtx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);
            } else if (type === 'reset') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.15);
            }
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.4);
        } catch (e) {}
    }

    submitGuess() {
        if (!this.gameActive) return;
        const valStr = this.inputEl.value;
        if (valStr === "") {
            this.feedbackEl.innerText = "[ERROR: ENTER A PATTERN VAL]";
            this.playTone('click');
            return;
        }

        const guess = parseInt(valStr, 10);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.feedbackEl.innerText = "[ERROR: OUT OF RANGE]";
            this.inputEl.value = "";
            this.playTone('click');
            return;
        }

        this.attempts++;
        this.attemptsEl.innerText = this.attempts;
        this.lastGuessEl.innerText = guess;

        if (guess > this.targetNum) {
            this.feedbackEl.innerText = `[OVERFLOW] // VAL ${guess} IS TOO HIGH`;
            this.feedbackEl.style.color = "var(--neon-pink)";
            this.feedbackEl.style.textShadow = "var(--shadow-pink)";
            this.displayPanelEl.style.borderColor = "var(--neon-pink)";
            
            // Shrink active bounds
            this.maxBound = Math.min(this.maxBound, guess - 1);
            this.updateBoundsUI();

            this.playTone('high');
            this.inputEl.value = "";
        } else if (guess < this.targetNum) {
            this.feedbackEl.innerText = `[UNDERFLOW] // VAL ${guess} IS TOO LOW`;
            this.feedbackEl.style.color = "var(--neon-yellow)";
            this.feedbackEl.style.textShadow = "0 0 10px var(--neon-yellow)";
            this.displayPanelEl.style.borderColor = "var(--neon-yellow)";
            
            // Shrink active bounds
            this.minBound = Math.max(this.minBound, guess + 1);
            this.updateBoundsUI();

            this.playTone('low');
            this.inputEl.value = "";
        } else {
            const scoreVal = Math.max(10, 110 - this.attempts * 10);
            this.feedbackEl.innerText = `[DECRYPTED] // SUCCESS IN ${this.attempts} ATTEMPTS! +${scoreVal} PTS`;
            this.feedbackEl.style.color = "var(--neon-green)";
            this.feedbackEl.style.textShadow = "0 0 10px var(--neon-green)";
            this.displayPanelEl.style.borderColor = "var(--neon-green)";
            this.statusEl.innerText = "CLEAR";
            this.statusEl.className = "value green-text";
            this.gameActive = false;
            
            // Perfect match on bounds
            this.minBound = this.targetNum;
            this.maxBound = this.targetNum;
            this.updateBoundsUI();

            this.playTone('win');
            this.saveHighScore(scoreVal);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.decrypterEngine = new PasscodeDecrypter();
});

function pressKey(val) {
    if (!window.decrypterEngine) return;
    if (val === 'CLEAR') {
        window.decrypterEngine.clearInput();
    } else if (val === 'DELETE') {
        window.decrypterEngine.deleteLastDigit();
    } else {
        window.decrypterEngine.pressDigit(val);
    }
}

function submitGuess() {
    if (window.decrypterEngine) {
        window.decrypterEngine.submitGuess();
    }
}

function resetGuessTarget() {
    if (window.decrypterEngine) {
        window.decrypterEngine.resetGame();
    }
}
