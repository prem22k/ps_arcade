// Step 22: feat: connect dodger high scores to unified localStorage registry keys
// Neon Space Dodger - Crown Jewel Game Engine
// Encapsulates high-performance vector physics, particle dynamics, and Web Audio FX.

class NeonSpaceDodger {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game states
        this.active = false;
        this.score = 0;
        this.highScore = 0;
        this.shield = 100;
        this.level = 1;
        this.keys = {};
        
        // Entity arrays
        this.asteroids = [];
        this.lasers = [];
        this.particles = [];
        this.stars = [];
        
        // Timers
        this.spawnTimer = 0;
        this.spawnInterval = 75; // frames between spawns
        this.lastFrameTime = 0;
        
        // Synth Audio
        this.audioCtx = null;
        this.thrusterOsc = null;
        this.thrusterGain = null;
        
        // Bind UI Elements
        this.liveScoreEl = document.getElementById('live-score');
        this.shieldFillEl = document.getElementById('shield-bar');
        this.shieldTextEl = document.getElementById('shield-text');
        this.vectorEl = document.getElementById('vector-reading');
        this.highScoreEl = document.getElementById('high-score');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.gameOverOverlay = document.getElementById('game-over-overlay');
        
        // Initialize structures
        this.initStars();
        this.loadHighScore();
        this.bindEvents();
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
            drag: 0.96, // friction coefficient
            shield: 100,
            invulnerable: 0 // invulnerability frames
        };
    }

    loadHighScore() {
        try {
            const stored = localStorage.getItem('dodger_high_score');
            if (stored) {
                this.highScore = parseInt(stored, 10) || 0;
            } else {
                this.highScore = 0;
            }
            this.highScoreEl.innerText = String(this.highScore).padStart(4, '0');
        } catch (e) {
            console.error('[STORAGE_ERROR] High score read failure:', e);
            this.highScore = 0;
        }
    }

    saveHighScore() {
        try {
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('dodger_high_score', this.highScore);
                this.highScoreEl.innerText = String(this.highScore).padStart(4, '0');
                return true;
            }
        } catch (e) {
            console.warn('[STORAGE_WARNING] High score write failure:', e);
        }
        return false;
    }

    bindEvents() {
        // Keyboard inputs
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.keys[e.code] = true; // backups for Spacebar
            
            // Prevent standard browser viewport scrolls for control layout
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key) || e.code === 'Space') {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.keys[e.code] = false;
        });

        // Overlay buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            this.initAudio();
            this.startGame();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.initAudio();
            this.startGame();
        });
    }

    initAudio() {
        if (this.audioCtx) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.setupThrusterHum();
        } catch (e) {
            console.warn('[AUDIO_WARNING] Synth context failure:', e);
        }
    }

    setupThrusterHum() {
        if (!this.audioCtx) return;
        try {
            this.thrusterOsc = this.audioCtx.createOscillator();
            this.thrusterGain = this.audioCtx.createGain();
            
            this.thrusterOsc.type = 'sawtooth';
            this.thrusterOsc.frequency.setValueAtTime(55, this.audioCtx.currentTime); // Low 55Hz pitch
            
            // Setup a low pass filter to make it a deep hum
            const filter = this.audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(110, this.audioCtx.currentTime);
            
            this.thrusterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
            
            this.thrusterOsc.connect(filter);
            filter.connect(this.thrusterGain);
            this.thrusterGain.connect(this.audioCtx.destination);
            
            this.thrusterOsc.start();
        } catch (e) {
            console.error('[AUDIO_ERROR] Hum setup failure:', e);
        }
    }

    playLaserSound() {
        if (!this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
            // Quick linear sweep pitch
            osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.12);
            
            gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.15);
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.15);
        } catch (e) {
            // silent fail
        }
    }

    playExplosionSound(isLarge = false) {
        if (!this.audioCtx) return;
        try {
            // Synthesize white noise buffer
            const bufferSize = this.audioCtx.sampleRate * (isLarge ? 0.6 : 0.25);
            const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.audioCtx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            // Low rumble filters
            filter.frequency.setValueAtTime(isLarge ? 150 : 350, this.audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime + (isLarge ? 0.5 : 0.2));
            
            const gain = this.audioCtx.createGain();
            gain.gain.setValueAtTime(isLarge ? 0.25 : 0.1, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + (isLarge ? 0.6 : 0.25));
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            noise.start();
        } catch (e) {
            // silent fail
        }
    }

    startGame() {
        this.active = true;
        this.score = 0;
        this.shield = 100;
        this.level = 1;
        this.asteroids = [];
        this.lasers = [];
        this.particles = [];
        
        this.resetPlayer();
        this.initStars();
        
        this.liveScoreEl.innerText = '0000';
        this.updateShieldHUD();
        
        this.menuOverlay.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');
        
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        
        // Start game tick loop
        this.lastFrameTime = performance.now();
        requestAnimationFrame((t) => this.tick(t));
    }

    triggerGameOver() {
        this.active = false;
        this.playExplosionSound(true);
        this.spawnShipExplosion();
        
        if (this.thrusterGain) {
            this.thrusterGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.05);
        }
        
        setTimeout(() => {
            const recordBroken = this.saveHighScore();
            document.getElementById('final-score').innerText = this.score;
            document.getElementById('record-status').innerText = recordBroken ? 'NEW RECORD!' : 'NO';
            this.gameOverOverlay.classList.remove('hidden');
        }, 1200);
    }

    spawnShipExplosion() {
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 1 + Math.random() * 8;
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                radius: 1 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#00f0ff' : '#ff0055',
                life: 1.0,
                decay: 0.015 + Math.random() * 0.02
            });
        }
    }

    spawnAsteroidExplosion(x, y, radius) {
        const count = Math.min(30, Math.floor(radius * 1.2));
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 0.5 + Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                radius: 1 + Math.random() * 2,
                color: '#cbd5e1', // Rock gray debris
                life: 0.9,
                decay: 0.02 + Math.random() * 0.03
            });
        }
    }

    updateShieldHUD() {
        this.shieldFillEl.style.width = `${this.shield}%`;
        this.shieldTextEl.innerText = `${this.shield}%`;
        
        if (this.shield > 50) {
            this.shieldFillEl.style.backgroundColor = 'var(--neon-green)';
            this.shieldTextEl.className = 'value green-text';
        } else if (this.shield > 20) {
            this.shieldFillEl.style.backgroundColor = 'var(--neon-yellow)';
            this.shieldTextEl.className = 'value yellow-text';
        } else {
            this.shieldFillEl.style.backgroundColor = 'var(--neon-pink)';
            this.shieldTextEl.className = 'value pink-text pulsing';
        }
    }

    fireLaser() {
        if (!this.active) return;
        this.lasers.push({
            x: this.player.x,
            y: this.player.y - 12,
            vx: this.player.vx * 0.3,
            vy: -10, // Fast upward vector
            width: 3,
            height: 12
        });
        this.playLaserSound();
    }

    tick(timestamp) {
        if (!this.active && this.particles.length === 0) return;
        
        this.ctx.fillStyle = '#01040a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateStars();
        this.updateParticles();
        
        if (this.active) {
            this.updatePlayerPhysics();
            this.updateLasers();
            this.updateAsteroids();
            this.checkCollisions();
            this.drawPlayer();
        }
        
        this.drawEntities();
        
        if (this.active) {
            requestAnimationFrame((t) => this.tick(t));
        } else {
            // Keep drawing remaining floating explosion particles
            requestAnimationFrame((t) => this.tick(t));
        }
    }

    updateStars() {
        this.ctx.fillStyle = '#fff';
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            this.ctx.fillStyle = star.color;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    updatePlayerPhysics() {
        const p = this.player;
        p.ax = 0;
        p.ay = 0;
        
        // Vector forces steer check
        if (this.keys['w'] || this.keys['ArrowUp']) p.ay = -p.thrust;
        if (this.keys['s'] || this.keys['ArrowDown']) p.ay = p.thrust;
        if (this.keys['a'] || this.keys['ArrowLeft']) p.ax = -p.thrust;
        if (this.keys['d'] || this.keys['ArrowRight']) p.ax = p.thrust;
        
        // Laser fire check
        if (this.keys['Space'] || this.keys[' ']) {
            if (!this.spaceBarLocked) {
                this.fireLaser();
                this.spaceBarLocked = true;
            }
        } else {
            this.spaceBarLocked = false;
        }
        
        // Integrate acceleration vectors
        p.vx += p.ax;
        p.vy += p.ay;
        
        // Coefficient of drag friction
        p.vx *= p.drag;
        p.vy *= p.drag;
        
        // Translate coordinates
        p.x += p.vx;
        p.y += p.vy;
        
        // Elastic borders collision calculations
        if (p.x < p.radius) {
            p.x = p.radius;
            p.vx = -p.vx * 0.4;
        } else if (p.x > this.canvas.width - p.radius) {
            p.x = this.canvas.width - p.radius;
            p.vx = -p.vx * 0.4;
        }
        
        if (p.y < p.radius) {
            p.y = p.radius;
            p.vy = -p.vy * 0.4;
        } else if (p.y > this.canvas.height - p.radius) {
            p.y = this.canvas.height - p.radius;
            p.vy = -p.vy * 0.4;
        }
        
        // Invulnerable counter
        if (p.invulnerable > 0) p.invulnerable--;
        
        // Speed gauge HUD
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 20; // scale factor
        this.vectorEl.innerText = `${currentSpeed.toFixed(1)} px/s`;
        
        // Map audio thrust oscillator gain
        if (this.thrusterGain && this.audioCtx) {
            const isThrusting = Math.abs(p.ax) > 0.1 || Math.abs(p.ay) > 0.1;
            const targetVolume = isThrusting ? 0.04 : 0.005;
            const targetPitch = 55 + currentSpeed * 2.5;
            this.thrusterGain.gain.setTargetAtTime(targetVolume, this.audioCtx.currentTime, 0.08);
            this.thrusterOsc.frequency.setTargetAtTime(targetPitch, this.audioCtx.currentTime, 0.1);
        }
    }

    updateLasers() {
        this.lasers.forEach((laser, idx) => {
            laser.y += laser.vy;
            laser.x += laser.vx;
            
            // Boundary delete checks
            if (laser.y < -20 || laser.x < 0 || laser.x > this.canvas.width) {
                this.lasers.splice(idx, 1);
            }
        });
    }

    updateAsteroids() {
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            
            const radius = 12 + Math.random() * 26; // jagged shapes sizes
            // Create random vertex points offsets list to draw jagged rocks
            const points = [];
            const offsetCount = 8 + Math.floor(Math.random() * 6);
            for (let i = 0; i < offsetCount; i++) {
                points.push(0.8 + Math.random() * 0.4);
            }
            
            this.asteroids.push({
                x: Math.random() * this.canvas.width,
                y: -40,
                vx: -1.5 + Math.random() * 3,
                vy: 1.8 + Math.random() * 2.2 + (this.level * 0.3),
                radius: radius,
                points: points,
                angle: 0,
                spin: -0.03 + Math.random() * 0.06
            });
            
            // Gradually speed up spawn speeds
            if (this.spawnInterval > 35) this.spawnInterval -= 0.5;
        }

        this.asteroids.forEach((asteroid, idx) => {
            asteroid.y += asteroid.vy;
            asteroid.x += asteroid.vx;
            asteroid.angle += asteroid.spin;
            
            // Screen delete checks
            if (asteroid.y > this.canvas.height + 40 || asteroid.x < -40 || asteroid.x > this.canvas.width + 40) {
                this.asteroids.splice(idx, 1);
                
                // Score 1 point for clear dodges
                if (this.active) {
                    this.score += 1;
                    this.liveScoreEl.innerText = String(this.score).padStart(4, '0');
                    if (this.score % 50 === 0) {
                        this.level++;
                    }
                }
            }
        });
    }

    updateParticles() {
        this.particles.forEach((particle, idx) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(idx, 1);
            }
        });
    }

    checkCollisions() {
        const p = this.player;
        
        // 1. Lasers vs Asteroids
        this.lasers.forEach((laser, lIdx) => {
            this.asteroids.forEach((asteroid, aIdx) => {
                const dist = Math.hypot(laser.x - asteroid.x, laser.y - asteroid.y);
                if (dist < asteroid.radius + 2) {
                    // Collision matches!
                    this.lasers.splice(lIdx, 1);
                    this.playExplosionSound(false);
                    this.spawnAsteroidExplosion(asteroid.x, asteroid.y, asteroid.radius);
                    this.asteroids.splice(aIdx, 1);
                    
                    this.score += 5; // Extra points for firing
                    this.liveScoreEl.innerText = String(this.score).padStart(4, '0');
                }
            });
        });
        
        // 2. Asteroids vs Ship
        if (p.invulnerable > 0) return;
        
        this.asteroids.forEach((asteroid, idx) => {
            const dist = Math.hypot(p.x - asteroid.x, p.y - asteroid.y);
            if (dist < p.radius + asteroid.radius * 0.8) {
                // Ship hit!
                this.playExplosionSound(false);
                this.spawnAsteroidExplosion(asteroid.x, asteroid.y, asteroid.radius);
                this.asteroids.splice(idx, 1);
                
                // Lose shield capacity
                const damage = Math.floor(asteroid.radius * 1.1);
                this.shield = Math.max(0, this.shield - damage);
                this.updateShieldHUD();
                
                p.invulnerable = 35; // Temporary shield blink frames
                
                if (this.shield <= 0) {
                    this.triggerGameOver();
                }
            }
        });
    }

    drawPlayer() {
        const p = this.player;
        
        // Draw blink shield if invulnerable
        if (p.invulnerable > 0 && Math.floor(p.invulnerable / 3) % 2 === 0) {
            return; // Skip rendering frame for flashing effect
        }
        
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        
        // Space thruster flame trail
        if (this.keys['w'] || this.keys['ArrowUp'] || Math.hypot(p.vx, p.vy) > 1.5) {
            this.ctx.beginPath();
            this.ctx.moveTo(-6, 8);
            this.ctx.lineTo(0, 18 + Math.random() * 8);
            this.ctx.lineTo(6, 8);
            this.ctx.closePath();
            this.ctx.fillStyle = '#ff0055';
            this.ctx.fill();
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ff0055';
        }
        
        // Draw neon cyan vector jet shape
        this.ctx.beginPath();
        this.ctx.moveTo(0, -15);
        this.ctx.lineTo(-12, 10);
        this.ctx.lineTo(-4, 6);
        this.ctx.lineTo(4, 6);
        this.ctx.lineTo(12, 10);
        this.ctx.closePath();
        
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
        this.ctx.fill();
        
        // Add neon glowing engine base
        this.ctx.beginPath();
        this.ctx.arc(0, 5, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff0055';
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawEntities() {
        // Draw Asteroids
        this.asteroids.forEach(asteroid => {
            this.ctx.save();
            this.ctx.translate(asteroid.x, asteroid.y);
            this.ctx.rotate(asteroid.angle);
            
            this.ctx.beginPath();
            const sliceAngle = (Math.PI * 2) / asteroid.points.length;
            for (let i = 0; i < asteroid.points.length; i++) {
                const r = asteroid.radius * asteroid.points[i];
                const x = Math.cos(sliceAngle * i) * r;
                const y = Math.sin(sliceAngle * i) * r;
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            
            this.ctx.strokeStyle = '#cbd5e1'; // Space Rock steel gray
            this.ctx.lineWidth = 1.8;
            this.ctx.stroke();
            this.ctx.fillStyle = 'rgba(203, 213, 225, 0.04)';
            this.ctx.fill();
            
            this.ctx.restore();
        });
        
        // Draw lasers
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.fillStyle = '#00f0ff';
        this.lasers.forEach(laser => {
            this.ctx.fillRect(laser.x - laser.width / 2, laser.y, laser.width, laser.height);
        });
        
        // Draw explosion particles
        this.ctx.shadowBlur = 0;
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0; // Reset canvas opacity
    }
}

// Instantiate engine when DOM is active
document.addEventListener('DOMContentLoaded', () => {
    window.dodgerEngine = new NeonSpaceDodger();
});
