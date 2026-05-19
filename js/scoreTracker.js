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
    }
};
export const scoreTrackerExtension = {
    syncAllScores() {
        console.log('[SYS_TRACK] Syncing game score registry matrices...');
        const scores = {};
        let grandTotal = 0;
        
        Object.entries(gameRegistry).forEach(([game, key]) => {
            const rawScore = parseScoreSafe(key);
            scores[game] = rawScore;
            grandTotal += rawScore;
        });
        
        return { scores, grandTotal };
    }
};