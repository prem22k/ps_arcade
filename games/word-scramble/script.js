// Cypher Decryptor Scriptor Module
console.log('[SYS_INIT] Cypher Decryptor core initializing...');

const wordList = [
    "javascript", "arcade", "cookie", "scramble", "computer",
    "cyberpunk", "quantum", "mainframe", "database", "encryption",
    "decryption", "firewall", "network", "hacker", "vector",
    "matrix", "terminal", "reactor", "algorithm", "protocol"
];

class CypherSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playSuccess() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.07);
            
            gain.gain.setValueAtTime(0.12, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.25);
        });
    }
    
    playHint() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.2);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.2);
    }
    
    playSkip() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.linearRampToValueAtTime(250, now + 0.28);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.28);
    }
    
    playError() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(125, now);
        osc.frequency.linearRampToValueAtTime(65, now + 0.22);
        
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.22);
    }
}

class CypherDecryptor {
    constructor() {
        this.score = 0;
        this.highScore = 0;
        this.currentOriginalWord = "";
        this.currentScrambleWord = "";
        this.synth = new CypherSynth();
        
        this.scoreEl = document.getElementById('scramble-score');
        this.highScoreEl = document.getElementById('high-score');
        this.deckEl = document.getElementById('letter-deck');
        this.inputEl = document.getElementById('guess-input');
        
        this.init();
    }
    
    init() {
        this.loadScores();
        this.updateHUD();
        this.loadWord();
        this.setupEvents();
        this.setupKeyboard();
        this.logMessage("DECIPHER GRID ONLINE // READY FOR CODES", "info");
    }
    
    loadScores() {
        try {
            const raw = localStorage.getItem('score_word');
            const scoreVal = parseInt(raw, 10);
            this.highScore = isNaN(scoreVal) ? 0 : scoreVal;
        } catch (e) {
            console.error("Score load aborted:", e);
            this.highScore = 0;
        }
        this.score = 0; // Starts session score at 0
    }
    
    saveHighScore() {
        try {
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('score_word', this.highScore.toString());
                this.logMessage(`NEW HIGH RECORD SYNCHRONIZED: ${this.highScore} CODES`, "success");
            }
        } catch (e) {
            console.error("Score sync error:", e);
        }
    }
    
    updateHUD() {
        if (this.scoreEl) this.scoreEl.innerText = this.score;
        if (this.highScoreEl) this.highScoreEl.innerText = this.highScore;
    }
    
    setupEvents() {
        const engageBtn = document.getElementById('btn-engage');
        if (engageBtn) engageBtn.addEventListener('click', () => this.checkWord());
        
        const hintBtn = document.getElementById('btn-hint');
        if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
        
        const skipBtn = document.getElementById('btn-skip');
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipWord());
    }
    
    scrambleWord(word) {
        let chars = word.split('');
        let scrambled = word;
        let attempts = 0;
        while (scrambled === word && attempts < 10) {
            chars.sort(() => Math.random() - 0.5);
            scrambled = chars.join('');
            attempts++;
        }
        return scrambled;
    }
    
    loadWord() {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        this.currentOriginalWord = wordList[randomIndex];
        this.currentScrambleWord = this.scrambleWord(this.currentOriginalWord);
        
        this.renderLetters();
        if (this.inputEl) {
            this.inputEl.value = "";
            this.inputEl.focus();
        }
    }
    
    renderLetters() {
        if (!this.deckEl) return;
        this.deckEl.innerHTML = '';
        
        this.currentScrambleWord.split('').forEach((char, i) => {
            const capsule = document.createElement('span');
            capsule.className = 'letter-capsule';
            capsule.innerText = char.toUpperCase();
            // Stagger animation delays for high-end organic floating loops
            capsule.style.animationDelay = `${i * 0.08}s`;
            this.deckEl.appendChild(capsule);
        });
    }
    
    setupKeyboard() {
        if (!this.inputEl) return;
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkWord();
            }
        });
        
        // Auto focus loop
        document.addEventListener('click', (e) => {
            if (this.inputEl && document.activeElement !== this.inputEl) {
                // Only refocus if not clicking on buttons
                if (!e.target.closest('.upgrade-card') && !e.target.closest('.back-btn')) {
                    this.inputEl.focus();
                }
            }
        });
    }
    
    checkWord() {
        if (!this.inputEl) return;
        const guess = this.inputEl.value.trim().toLowerCase();
        
        if (guess === this.currentOriginalWord.toLowerCase()) {
            this.score++;
            this.synth.playSuccess();
            this.logMessage(`ACCESS GRANTED // CYPHER DECRYPTED: ${this.currentOriginalWord.toUpperCase()}`, "success");
            this.inputEl.value = "";
            this.saveHighScore();
            this.updateHUD();
            this.loadWord();
        } else {
            this.synth.playError();
            this.logMessage(`ACCESS DENIED // KEY MATCH MISMATCH`, "error");
        }
    }
    
    showHint() {
        this.synth.playHint();
        const firstLetter = this.currentOriginalWord.charAt(0).toUpperCase();
        this.logMessage(`DECRYPTION INJECT OVERRIDE: FIRST CHAR IS "${firstLetter}"`, "warning");
        if (this.inputEl) this.inputEl.focus();
    }
    
    skipWord() {
        this.synth.playSkip();
        const oldWord = this.currentOriginalWord.toUpperCase();
        if (this.score > 0) {
            this.score--;
        }
        this.logMessage(`BYPASS TRIPPED // DUMPED CYPHER: ${oldWord} // -1 DECRYPT YIELD`, "warning");
        this.updateHUD();
        this.inputEl.value = "";
        this.loadWord();
    }
    
    logMessage(message, type = 'info') {
        const logsEl = document.getElementById('terminal-logs');
        if (!logsEl) return;
        
        const time = new Date().toLocaleTimeString().split(' ')[0];
        const line = document.createElement('div');
        line.className = `log-line log-${type}`;
        
        let prefix = '[SYS_INFO]';
        if (type === 'success') prefix = '[SEC_OK]  ';
        if (type === 'error')   prefix = '[ALERT]   ';
        if (type === 'warning') prefix = '[WARN]    ';
        
        line.innerText = `${time} - ${prefix} > ${message}`;
        logsEl.appendChild(line);
        logsEl.scrollTop = logsEl.scrollHeight;
    }
}

const decryptor = new CypherDecryptor();
window.decryptor = decryptor;
