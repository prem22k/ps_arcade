// Serpentine Cyber Grid core initializing...
console.log('[SYS_INIT] Serpentine grid online.');

class SerpentSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    
    playFeed() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    playExplosion() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.4);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    }
    
    playCharge() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }
}

class CyberGridSerpentine {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('score-display');
        this.recordDisplay = document.getElementById('record-display');
        
        this.gridSize = 20;
        this.snake = [
            {x: 160, y: 200},
            {x: 140, y: 200},
            {x: 120, y: 200}
        ];
        
        this.dx = this.gridSize;
        this.dy = 0;
        this.foodX = 240;
        this.foodY = 200;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snake_high_score')) || 0;
        this.gameActive = false;
        this.synth = new SerpentSynth();
        
        this.loopInterval = null;
        this.speedCoeff = 150;
        this.controlMode = 'dpad'; // 'dpad' or 'gestures'
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
        this.logMessage("CYBER_SERPENT GRID SECURED // STEER CORE ENGINES", "info");
        this.drawScene();
        
        // Sync mute status from global localStorage if available
        const globalSound = localStorage.getItem('arcade_sound_enabled');
        if (globalSound === 'false') {
            this.synth.muted = true;
        }
    }
    
    setupEvents() {
        // Prevent key scrolls and steer serpent
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].indexOf(key) > -1) {
                e.preventDefault();
            }
            if ((key === 'arrowup' || key === 'w') && this.dy === 0) { this.dx = 0; this.dy = -this.gridSize; }
            else if ((key === 'arrowdown' || key === 's') && this.dy === 0) { this.dx = 0; this.dy = this.gridSize; }
            else if ((key === 'arrowleft' || key === 'a') && this.dx === 0) { this.dx = -this.gridSize; this.dy = 0; }
            else if ((key === 'arrowright' || key === 'd') && this.dx === 0) { this.dx = this.gridSize; this.dy = 0; }
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startSerpentine();
        });

        // Virtual Touch D-pad control bindings
        const bindDirectionButton = (id, direction) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                if (!this.gameActive || this.controlMode !== 'dpad') return;
                
                if (direction === 'up' && this.dy === 0) { this.dx = 0; this.dy = -this.gridSize; }
                else if (direction === 'down' && this.dy === 0) { this.dx = 0; this.dy = this.gridSize; }
                else if (direction === 'left' && this.dx === 0) { this.dx = -this.gridSize; this.dy = 0; }
                else if (direction === 'right' && this.dx === 0) { this.dx = this.gridSize; this.dy = 0; }
            });
        };

        bindDirectionButton('ctrl-up', 'up');
        bindDirectionButton('ctrl-down', 'down');
        bindDirectionButton('ctrl-left', 'left');
        bindDirectionButton('ctrl-right', 'right');

        // Setup control mode toggling
        const modeBtn = document.getElementById('ctrl-mode-btn');
        const dpadEl = document.getElementById('mobile-dpad');
        const swipeHintEl = document.getElementById('mobile-swipe-hint');
        
        if (modeBtn) {
            modeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.synth.init(); // interact to allow synth play
                if (this.controlMode === 'dpad') {
                    this.controlMode = 'gestures';
                    modeBtn.innerText = '[MODE: SWIPE]';
                    if (dpadEl) dpadEl.style.display = 'none';
                    if (swipeHintEl) swipeHintEl.style.display = 'block';
                    this.logMessage("CONTROL_MODE SHIFTED // ACTIVE: GESTURES", "info");
                } else {
                    this.controlMode = 'dpad';
                    modeBtn.innerText = '[MODE: D-PAD]';
                    if (dpadEl) dpadEl.style.display = 'grid';
                    if (swipeHintEl) swipeHintEl.style.display = 'none';
                    this.logMessage("CONTROL_MODE SHIFTED // ACTIVE: D-PAD", "info");
                }
            });
        }

        // Setup touch swipe gesture handlers on canvas
        let touchStartX = 0;
        let touchStartY = 0;
        if (this.canvas) {
            this.canvas.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            this.canvas.addEventListener('touchend', (e) => {
                if (this.controlMode !== 'gestures' || !this.gameActive) return;
                
                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;
                
                const dx = touchEndX - touchStartX;
                const dy = touchEndY - touchStartY;
                const threshold = 30; // minimum swipe distance
                
                if (Math.max(Math.abs(dx), Math.abs(dy)) > threshold) {
                    if (Math.abs(dx) > Math.abs(dy)) {
                        // Horizontal turn
                        if (dx > 0 && this.dx === 0) {
                            this.dx = this.gridSize; this.dy = 0;
                        } else if (dx < 0 && this.dx === 0) {
                            this.dx = -this.gridSize; this.dy = 0;
                        }
                    } else {
                        // Vertical turn
                        if (dy > 0 && this.dy === 0) {
                            this.dx = 0; this.dy = this.gridSize;
                        } else if (dy < 0 && this.dy === 0) {
                            this.dx = 0; this.dy = -this.gridSize;
                        }
                    }
                }
            }, { passive: true });
        }
    }
    
    startSerpentine() {
        if (this.loopInterval) clearInterval(this.loopInterval);
        this.score = 0;
        this.speedCoeff = 150;
        this.dx = this.gridSize;
        this.dy = 0;
        this.snake = [
            {x: 160, y: 200},
            {x: 140, y: 200},
            {x: 120, y: 200}
        ];
        this.gameActive = true;
        this.scoreDisplay.innerText = this.score;
        this.synth.playCharge();
        this.logMessage("VECTOR SERPENT ENGAGED // COMMENCING GRID RUN", "warning");
        this.randomFood();
        
        this.loopInterval = setInterval(() => this.gameStep(), this.speedCoeff);
    }
    
    randomFood() {
        this.foodX = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
        this.foodY = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
    }
    
    checkSelfCollision(head) {
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) return true;
        }
        return false;
    }
    
    gameStep() {
        if (!this.gameActive) return;
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Wall or Self Collisions
        if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height || this.checkSelfCollision(head)) {
            this.triggerGameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.foodX && head.y === this.foodY) {
            this.score += 10;
            this.scoreDisplay.innerText = this.score;
            this.synth.playFeed();
            this.logMessage(`HACKER NODE ENCRYPTED (+10)`, "success");
            this.randomFood();
            
            // Dynamic speed ramping
            clearInterval(this.loopInterval);
            this.speedCoeff = Math.max(70, 150 - this.score);
            this.loopInterval = setInterval(() => this.gameStep(), this.speedCoeff);
        } else {
            this.snake.pop();
        }
        
        this.drawScene();
    }
    
    drawScene() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines subtly
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Draw Food core
        this.ctx.fillStyle = '#ff0055';
        this.ctx.shadowColor = '#ff0055';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(this.foodX + 2, this.foodY + 2, this.gridSize - 4, this.gridSize - 4);
        
        // Draw serpent segments
        this.snake.forEach((part, index) => {
            const isHead = index === 0;
            this.ctx.fillStyle = isHead ? '#fff' : '#00f0ff';
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.shadowBlur = isHead ? 15 : 6;
            this.ctx.fillRect(part.x + 1, part.y + 1, this.gridSize - 2, this.gridSize - 2);
        });
        this.ctx.shadowBlur = 0; // reset
    }
    
    triggerGameOver() {
        clearInterval(this.loopInterval);
        this.gameActive = false;
        this.synth.playExplosion();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake_high_score', this.highScore);
            this.recordDisplay.innerText = this.highScore;
            this.logMessage(`NEW HIGH RECORD SYNCHRONIZED: ${this.highScore}`, "success");
        }
        
        this.logMessage(`CRITICAL COLLISION // SERPENT DEACTIVATED`, "error");
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

const game = new CyberGridSerpentine();
window.game = game;
