// Cypher Decryptor Scriptor Module
console.log('[SYS_INIT] Cypher Decryptor core initializing...');

const wordList = [
    "javascript", "arcade", "cookie", "scramble", "computer",
    "cyberpunk", "quantum", "mainframe", "database", "encryption",
    "decryption", "firewall", "network", "hacker", "vector",
    "matrix", "terminal", "reactor", "algorithm", "protocol"
];

class CypherDecryptor {
    constructor() {
        this.score = 0;
        this.highScore = 0;
        this.currentOriginalWord = "";
        this.currentScrambleWord = "";
        
        this.scoreEl = document.getElementById('scramble-score');
        this.highScoreEl = document.getElementById('high-score');
        this.deckEl = document.getElementById('letter-deck');
        this.inputEl = document.getElementById('guess-input');
        
        this.init();
    }
    
    init() {
        this.updateHUD();
        this.loadWord();
        this.setupEvents();
    }
    
    updateHUD() {
        if (this.scoreEl) this.scoreEl.innerText = this.score;
        if (this.highScoreEl) this.highScoreEl.innerText = this.highScore;
    }
    
    setupEvents() {
        const engageBtn = document.getElementById('btn-engage');
        if (engageBtn) engageBtn.addEventListener('click', () => this.checkWord());
        
        const hintBtn = document.getElementById('btn-hint');
        if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
        
        const skipBtn = document.getElementById('btn-skip');
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipWord());
    }
    
    scrambleWord(word) {
        let chars = word.split('');
        let scrambled = word;
        let attempts = 0;
        while (scrambled === word && attempts < 10) {
            chars.sort(() => Math.random() - 0.5);
            scrambled = chars.join('');
            attempts++;
        }
        return scrambled;
    }
    
    loadWord() {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        this.currentOriginalWord = wordList[randomIndex];
        this.currentScrambleWord = this.scrambleWord(this.currentOriginalWord);
        
        this.renderLetters();
    }
    
    renderLetters() {
        if (!this.deckEl) return;
        this.deckEl.innerHTML = '';
        
        this.currentScrambleWord.split('').forEach((char) => {
            const capsule = document.createElement('span');
            capsule.className = 'letter-capsule';
            capsule.innerText = char.toUpperCase();
            this.deckEl.appendChild(capsule);
        });
    }
    
    checkWord() {
        console.log("Engage triggered");
    }
    
    showHint() {
        console.log("Hint triggered");
    }
    
    skipWord() {
        console.log("Skip triggered");
    }
}

const decryptor = new CypherDecryptor();
window.decryptor = decryptor;
