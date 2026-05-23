// Grid Nexus Scriptor Module
console.log('[SYS_INIT] Grid Nexus matrix core initializing...');

class GridNexus {
    constructor() {
        this.board = ["", "", "", "", "", "", "", "", ""];
        this.currentPlayer = "X";
        this.gameActive = true;
        
        this.cells = document.querySelectorAll('.cell');
        this.turnEl = document.getElementById('player-turn');
        
        this.init();
    }
    
    init() {
        this.setupEvents();
    }
    
    setupEvents() {
        this.cells.forEach((cell) => {
            cell.addEventListener('click', () => {
                if (!this.gameActive) return;
                const idx = parseInt(cell.getAttribute('data-index'));
                if (this.board[idx] !== "") return;
                
                this.makeMove(cell, idx);
            });
        });
        
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetMatrix());
    }
    
    makeMove(cell, idx) {
        this.board[idx] = this.currentPlayer;
        cell.innerText = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        // Simple swap for stage2
        this.currentPlayer = (this.currentPlayer === "X") ? "O" : "X";
        if (this.turnEl) {
            this.turnEl.innerText = `Player ${this.currentPlayer}'s Turn`;
            this.turnEl.className = `turn-indicator ${this.currentPlayer === "X" ? "cyan-text" : "pink-text"}`;
        }
    }
    
    resetMatrix() {
        this.board = ["", "", "", "", "", "", "", "", ""];
        this.currentPlayer = "X";
        this.gameActive = true;
        
        if (this.turnEl) {
            this.turnEl.innerText = "Player X's Turn";
            this.turnEl.className = "turn-indicator cyan-text";
        }
        
        this.cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('x', 'o');
        });
    }
}

const game = new GridNexus();
window.game = game;
