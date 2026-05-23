// Grid Nexus Scriptor Module
console.log('[SYS_INIT] Grid Nexus matrix core initializing...');

class GridNexusSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playX() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(1300, now + 0.12);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
    }
    
    playO() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
    }
    
    playSuccess() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [293.66, 349.23, 440.00, 587.33]; // D4, F4, A4, D5 arpeggio
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            
            gain.gain.setValueAtTime(0.1, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.25);
        });
    }
    
    playTie() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.linearRampToValueAtTime(350, now + 0.25);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.25);
    }
    
    playReset() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.3);
    }
}

class GridNexus {
    constructor() {
        this.board = ["", "", "", "", "", "", "", "", ""];
        this.currentPlayer = "X";
        this.gameActive = true;
        this.synth = new GridNexusSynth();
        
        this.cells = document.querySelectorAll('.cell');
        this.turnEl = document.getElementById('player-turn');
        
        this.init();
    }
    
    init() {
        this.setupEvents();
        this.logMessage("GRID NEXUS MATRIX SECURED // SYS_ACTIVE", "info");
    }
    
    setupEvents() {
        this.cells.forEach((cell) => {
            cell.addEventListener('click', () => {
                if (!this.gameActive) return;
                const idx = parseInt(cell.getAttribute('data-index'));
                if (this.board[idx] !== "") return;
                
                this.makeMove(cell, idx);
            });
        });
        
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetMatrix());
    }
    
    makeMove(cell, idx) {
        this.board[idx] = this.currentPlayer;
        cell.innerText = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        if (this.currentPlayer === "X") {
            this.synth.playX();
            this.logMessage(`SECTOR_${idx} DECRYPTED BY PLAYER_X`, "info");
        } else {
            this.synth.playO();
            this.logMessage(`SECTOR_${idx} DECRYPTED BY PLAYER_O`, "warning");
        }
        
        this.currentPlayer = (this.currentPlayer === "X") ? "O" : "X";
        if (this.turnEl) {
            this.turnEl.innerText = `Player ${this.currentPlayer}'s Turn`;
            this.turnEl.className = `turn-indicator ${this.currentPlayer === "X" ? "cyan-text" : "pink-text"}`;
        }
    }
    
    resetMatrix() {
        this.board = ["", "", "", "", "", "", "", "", ""];
        this.currentPlayer = "X";
        this.gameActive = true;
        this.synth.playReset();
        this.logMessage("REBOOT MATRIX CORE CHASSIS // DUMPING DATA", "warning");
        
        if (this.turnEl) {
            this.turnEl.innerText = "Player X's Turn";
            this.turnEl.className = "turn-indicator cyan-text";
        }
        
        this.cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('x', 'o');
        });
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

const game = new GridNexus();
window.game = game;
