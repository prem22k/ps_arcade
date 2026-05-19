let audioCtx = null;
let soundEnabled = true;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
};

export const cyberUi = {
    initSoundToggle() {
        soundEnabled = true;
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