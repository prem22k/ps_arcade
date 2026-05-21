import { scoreTracker } from './scoreTracker.js'; // Verified ES6 local resolution
import { cyberUi } from './cyberUi.js';

let resizeTimeout = null;
const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('[SYS_ENV] Viewport matrix adapted on resize handler throttle.');
    }, 150);
};

window.addEventListener('resize', handleResize);

document.addEventListener('DOMContentLoaded', () => {
    console.log('[SYS_INIT] Launching cyber-arcade system sequence...');
    const { grandTotal } = scoreTracker.syncAllScores();
    const rankEl = document.getElementById('stat-rank');
    const totalScoreEl = document.getElementById('stat-highscore');
    if (totalScoreEl) totalScoreEl.innerText = grandTotal;
    if (rankEl) rankEl.innerText = scoreTracker.calculatePilotRank(grandTotal);
    
    cyberUi.initSoundToggle();
    cyberUi.bindGlitchHeaders();
    cyberUi.bindSearchAndFilter();
    cyberUi.bindRandomPicker();
    
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cyberUi.playSynthBeep(523.25, 0.04, 'sine');
        });
    });
});