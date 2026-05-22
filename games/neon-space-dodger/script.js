// Step 13: feat: develop randomized asteroid obstacle spawning matrices and intervals
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
    }
}
