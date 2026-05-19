export const cyberUi = {
    initSoundToggle() {
        console.log('[SYS_UI] Sound registry toggling system active...');
    }
};
export const glitchText = (el) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//_@#$';
    const original = el.innerText;
    let iterations = 0;
    const interval = setInterval(() => {
        el.innerText = original.split('').map((c, i) => {
            if (i < iterations) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iterations >= original.length) clearInterval(interval);
        iterations += 1/3;
    }, 30);
};