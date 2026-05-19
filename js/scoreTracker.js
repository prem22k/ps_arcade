const gameRegistry = {
    'rock-paper-scissors': 'score_rps',
    'guess-number': 'score_guess',
    'clicker': 'cookieCount',
    'word-scramble': 'score_word',
    'tic-tac-toe': 'ttt_score_x',
    'whack-a-mole': 'whack_high_score',
    'snake': 'snake_high_score',
    'simon-says': 'simon_high_score',
    'block-stacker': 'block_high_score'
};

const parseScoreSafe = (key) => {
    try {
        const val = localStorage.getItem(key);
        if (!val) return 0;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 0 : parsed;
    } catch (e) {
        console.warn(`[SCORE_ERROR] Failed parsing storage key "${key}":`, e);
        return 0;
    }
};

export const scoreTracker = {
    getRegistry() {
        return { ...gameRegistry };
    },
    
    syncAllScores() {
        console.log('[SYS_TRACK] Syncing game score registry matrices...');
        const scores = {};
        let grandTotal = 0;
        
        Object.entries(gameRegistry).forEach(([game, key]) => {
            const rawScore = parseScoreSafe(key);
            scores[game] = rawScore;
            grandTotal += rawScore;
            
            const el = document.getElementById(`score-${game}`);
            if (el) el.innerText = rawScore;
        });
        
        console.log(`[SYS_TRACK] Global sum vector calculated: ${grandTotal}`);
        return { scores, grandTotal };
    },
    
    calculatePilotRank(scoreSum) {
        if (scoreSum === 0) return 'RECRUIT_D01';
        if (scoreSum < 10) return 'CYBER_INTRUDER';
        if (scoreSum < 50) return 'NET_RUNNER';
        if (scoreSum < 200) return 'GRID_MASTER';
        return 'NEON_ARCHITECT';
    }
};