// Step 14: feat: engineer obstacle down-scroll translation loops with speed curves
class NeonSpaceDodger {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.active = false;
        this.score = 0;
        this.highScore = 0;
        this.shield = 100;
        this.level = 1;
        this.keys = {};
        
        this.asteroids = [];
        this.lasers = [];
        this.particles = [];
        this.stars = [];
        
        this.spawnTimer = 0;
        this.spawnInterval = 75;
        this.lastFrameTime = 0;
        
        this.audioCtx = null;
        this.thrusterOsc = null;
        this.thrusterGain = null;
        
        this.liveScoreEl = document.getElementById('live-score');
        this.shieldFillEl = document.getElementById('shield-bar');
        this.shieldTextEl = document.getElementById('shield-text');
        this.vectorEl = document.getElementById('vector-reading');
        this.highScoreEl = document.getElementById('high-score');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.gameOverOverlay = document.getElementById('game-over-overlay');
        
        this.initStars();
        this.resetPlayer();
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: 0.5 + Math.random() * 2,
                size: 0.5 + Math.random() * 1.5,
                color: Math.random() > 0.5 ? '#00f0ff' : '#ff0055'
            });
        }
    }

    resetPlayer() {
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 80,
            radius: 14,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
            thrust: 0.42,
            drag: 0.96,
            shield: 100,
            invulnerable: 0
        };
    }
}
