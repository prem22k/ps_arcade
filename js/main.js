import { scoreTracker } from './scoreTracker.js';
import { cyberUi } from './cyberUi.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('[SYS_INIT] Launching cyber-arcade system sequence...');
    const { grandTotal } = scoreTracker.syncAllScores();
    const rankEl = document.getElementById('stat-rank');
    const totalScoreEl = document.getElementById('stat-highscore');
    if (totalScoreEl) totalScoreEl.innerText = grandTotal;
    if (rankEl) rankEl.innerText = scoreTracker.calculatePilotRank(grandTotal);
    
    cyberUi.initSoundToggle();
});