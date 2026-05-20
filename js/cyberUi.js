import { scoreTracker } from './scoreTracker.js';

let audioCtx = null;
let soundEnabled = true;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

export const cyberUi = {
    initSoundToggle() {
        const btn = document.getElementById('sound-toggle');
        if (!btn) return;
        const stored = localStorage.getItem('arcade_sound_enabled');
        soundEnabled = stored !== 'false';
        btn.innerText = soundEnabled ? '[AUDIO: ON]' : '[AUDIO: OFF]';
        
        btn.addEventListener('click', () => {
            initAudio();
            soundEnabled = !soundEnabled;
            localStorage.setItem('arcade_sound_enabled', soundEnabled);
            btn.innerText = soundEnabled ? '[AUDIO: ON]' : '[AUDIO: OFF]';
            this.playSynthBeep(440, 0.05, 'triangle');
        });
    },

    playSynthBeep(freq = 600, duration = 0.08, type = 'sine') {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.error('[AUDIO_ERROR] Failed synth generation:', e);
        }
    },

    bindGlitchHeaders() {
        const title = document.querySelector('.glitch-title');
        if (!title) return;
        const originalText = title.innerText;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//_@#$';
        
        title.addEventListener('mouseenter', () => {
            this.playSynthBeep(880, 0.05, 'square');
            let iterations = 0;
            const interval = setInterval(() => {
                title.innerText = originalText.split('').map((char, index) => {
                    if (index < iterations) return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    title.innerText = originalText;
                }
                iterations += 1/3;
            }, 30);
        });
    },

    bindSearchAndFilter() {
        const searchInput = document.getElementById('game-search');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.game-card');
        
        const filterState = { searchQuery: '', category: 'all' };
        
        const applyFilters = () => {
            const { searchQuery, category } = filterState;
            cards.forEach(card => {
                const title = card.querySelector('.card-title').innerText.toLowerCase();
                const desc = card.querySelector('.card-desc').innerText.toLowerCase();
                const cardCat = card.getAttribute('data-category');
                const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);
                const matchesCategory = category === 'all' || cardCat === category;
                
                if (matchesSearch && matchesCategory) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        };
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                filterState.searchQuery = e.target.value.toLowerCase().trim();
                applyFilters();
                this.playSynthBeep(200 + Math.random() * 600, 0.02, 'sine');
            });
        }
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterState.category = btn.getAttribute('data-category');
                applyFilters();
                this.playSynthBeep(350, 0.06, 'sawtooth');
            });
        });
    },

    bindRandomPicker() {
        const btn = document.getElementById('random-picker-btn');
        if (!btn) return;
        
        btn.addEventListener('click', () => {
            const activeCards = Array.from(document.querySelectorAll('.game-card:not(.hidden)'));
            if (activeCards.length === 0) return;
            
            let cycles = 0;
            const maxCycles = 10;
            btn.disabled = true;
            
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * activeCards.length);
                activeCards.forEach(c => c.style.borderColor = 'rgba(0, 240, 255, 0.2)');
                const selected = activeCards[randomIndex];
                selected.style.borderColor = '#ff0055';
                selected.style.boxShadow = '0 0 20px #ff0055';
                this.playSynthBeep(150 + cycles * 50, 0.03, 'sine');
                
                cycles++;
                if (cycles >= maxCycles) {
                    clearInterval(interval);
                    btn.disabled = false;
                    selected.style.borderColor = '#39ff14';
                    selected.style.boxShadow = '0 0 30px #39ff14';
                    this.playSynthBeep(600, 0.25, 'triangle');
                    setTimeout(() => {
                        const launchUrl = selected.querySelector('.cyber-btn').getAttribute('href');
                        window.location.href = launchUrl;
                    }, 800);
                }
            }, 80);
        });
    }
};