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
    }
};