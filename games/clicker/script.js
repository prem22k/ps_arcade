// Premium Reactor Fusion Core clicker engine
// Complete implementation of automated fusion generator cycles, core level indicators, custom oscillator arrays, and scoreTracker-compliant localStorage sync.

class QuantumReactor {
    constructor() {
        this.energy = 0;
        this.highScore = 0;
        this.mps = 0; // Megawatts per second
        this.clickPower = 1;
        this.coreLevel = 1;
        this.audioCtx = null;

        // Upgrade Costs and levels
        this.upgrades = {
            click: { count: 0, baseCost: 15, costMult: 1.25, mpc: 1 },
            auto: { count: 0, baseCost: 50, costMult: 1.25, mps: 1 },
            turbo: { count: 0, baseCost: 250, costMult: 1.30, mps: 8 }
        };

        // DOM Elements
        this.statusEl = document.getElementById('reactor-status');
        this.yieldEl = document.getElementById('reactor-yield');
        this.mpsEl = document.getElementById('reactor-mps');
        this.recordEl = document.getElementById('high-score');
        this.feedbackEl = document.getElementById('reactor-feedback');
        this.coreInnerEl = document.querySelector('.core-inner-sphere');

        this.init();
    }

    init() {
        this.loadGameData();
        this.updateHUD();
        this.startFusionCycle();
    }

    loadGameData() {
        try {
            // Load clicks count
            const savedEnergy = localStorage.getItem('cookieClicks');
            this.energy = savedEnergy ? parseInt(savedEnergy, 10) || 0 : 0;

            // Load high score
            const savedHigh = localStorage.getItem('cookieCount'); // high score maps to cookieCount
            this.highScore = savedHigh ? parseInt(savedHigh, 10) || 0 : 0;

            // Load upgrade states
            const savedClickCount = localStorage.getItem('upg_click_count');
            const savedAutoCount = localStorage.getItem('upg_auto_count');
            const savedTurboCount = localStorage.getItem('upg_turbo_count');

            if (savedClickCount) this.upgrades.click.count = parseInt(savedClickCount, 10) || 0;
            if (savedAutoCount) this.upgrades.auto.count = parseInt(savedAutoCount, 10) || 0;
            if (savedTurboCount) this.upgrades.turbo.count = parseInt(savedTurboCount, 10) || 0;

            // Calculate multipliers and automatic speeds
            this.clickPower = 1 + (this.upgrades.click.count * this.upgrades.click.mpc);
            this.mps = (this.upgrades.auto.count * this.upgrades.auto.mps) + (this.upgrades.turbo.count * this.upgrades.turbo.mps);
        } catch (e) {
            console.error('[STORAGE_ERROR] Reactor data load failure:', e);
        }
    }

    saveGameData() {
        try {
            localStorage.setItem('cookieClicks', Math.floor(this.energy));
            
            // Check & save high score
            if (this.energy > this.highScore) {
                this.highScore = Math.floor(this.energy);
                localStorage.setItem('cookieCount', this.highScore);
            }

            // Save upgrades
            localStorage.setItem('upg_click_count', this.upgrades.click.count);
            localStorage.setItem('upg_auto_count', this.upgrades.auto.count);
            localStorage.setItem('upg_turbo_count', this.upgrades.turbo.count);
        } catch (e) {
            console.warn('[STORAGE_WARNING] Reactor save failure:', e);
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

    playTone(type) {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.1);
            } else if (type === 'upgrade') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(880, this.audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.2);
            } else if (type === 'level') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(261.63, this.audioCtx.currentTime); // C4
                osc.frequency.linearRampToValueAtTime(329.63, this.audioCtx.currentTime + 0.1); // E4
                osc.frequency.linearRampToValueAtTime(392.00, this.audioCtx.currentTime + 0.2); // G4
                osc.frequency.linearRampToValueAtTime(523.25, this.audioCtx.currentTime + 0.35); // C5
                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.4);
            }

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.45);
        } catch (e) {}
    }

    triggerFusion() {
        this.playTone('click');
        this.energy += this.clickPower;
        
        // Add visual scale effect on click
        this.coreInnerEl.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.coreInnerEl.style.transform = '';
        }, 80);

        this.checkCoreLevel();
        this.saveGameData();
        this.updateHUD();
    }

    checkCoreLevel() {
        const prevLevel = this.coreLevel;
        if (this.energy < 100) this.coreLevel = 1;
        else if (this.energy < 500) this.coreLevel = 2;
        else if (this.energy < 2000) this.coreLevel = 3;
        else if (this.energy < 10000) this.coreLevel = 4;
        else this.coreLevel = 5;

        if (this.coreLevel > prevLevel) {
            this.playTone('level');
            this.feedbackEl.innerText = `[LEVEL_UP] // REACTOR ADVANCED TO LEVEL ${this.coreLevel}!`;
            this.feedbackEl.style.color = "var(--neon-green)";
            this.feedbackEl.style.textShadow = "0 0 10px var(--neon-green)";
            setTimeout(() => {
                this.feedbackEl.style.color = "";
                this.feedbackEl.style.textShadow = "";
            }, 3000);
        }
    }

    getUpgradeCost(type) {
        const upg = this.upgrades[type];
        return Math.floor(upg.baseCost * Math.pow(upg.costMult, upg.count));
    }

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (this.energy >= cost) {
            this.playTone('upgrade');
            this.energy -= cost;
            this.upgrades[type].count++;
            
            // Re-calculate speeds
            this.clickPower = 1 + (this.upgrades.click.count * this.upgrades.click.mpc);
            this.mps = (this.upgrades.auto.count * this.upgrades.auto.mps) + (this.upgrades.turbo.count * this.upgrades.turbo.mps);

            this.feedbackEl.innerText = `[SUCCESS] // UPGRADED ${type.toUpperCase()} SYSTEM TO LVL ${this.upgrades[type].count}`;
            
            this.saveGameData();
            this.updateHUD();
        } else {
            this.feedbackEl.innerText = `[ABORTED] // INSUFFICIENT ENERGY. REQUIRE ${cost} MW.`;
        }
    }

    startFusionCycle() {
        setInterval(() => {
            if (this.mps > 0) {
                this.energy += (this.mps / 10);
                this.checkCoreLevel();
                this.saveGameData();
                this.updateHUD();
            }
        }, 100);
    }

    updateHUD() {
        this.yieldEl.innerText = Math.floor(this.energy) + " MW";
        this.mpsEl.innerText = this.mps + " MW/s";
        this.recordEl.innerText = this.highScore + " MW";

        // Update levels status
        this.statusEl.innerText = `LVL_${this.coreLevel}`;
        if (this.mps > 0) {
            this.statusEl.className = "value green-text";
        } else {
            this.statusEl.className = "value cyan-text";
        }

        // Update shop costs and buyability styling
        Object.keys(this.upgrades).forEach(type => {
            const cost = this.getUpgradeCost(type);
            const costEl = document.getElementById(`upg-${type}-cost`);
            const cardEl = document.getElementById(`upg-${type}`);
            
            if (costEl) costEl.innerText = cost + " MW";
            if (cardEl) {
                if (this.energy >= cost) {
                    cardEl.classList.remove('disabled');
                } else {
                    cardEl.classList.add('disabled');
                }
            }
        });
    }

    reset() {
        this.playTone('click');
        this.energy = 0;
        this.mps = 0;
        this.clickPower = 1;
        this.coreLevel = 1;
        this.upgrades.click.count = 0;
        this.upgrades.auto.count = 0;
        this.upgrades.turbo.count = 0;

        this.feedbackEl.innerText = "[REBOOT] // FUSION MATRIX ZEROED OUT.";
        
        this.saveGameData();
        this.updateHUD();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.reactorEngine = new QuantumReactor();
});

function triggerCoreFusion() {
    if (window.reactorEngine) {
        window.reactorEngine.triggerFusion();
    }
}

function buyUpgrade(type) {
    if (window.reactorEngine) {
        window.reactorEngine.buyUpgrade(type);
    }
}

function resetReactor() {
    if (window.reactorEngine) {
        window.reactorEngine.reset();
    }
}
