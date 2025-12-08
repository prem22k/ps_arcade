var audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Frequency map
var freqs = {
    green: 261.63,  // C4
    red: 329.63,    // E4
    yellow: 392.00, // G4
    blue: 523.25    // C5
};