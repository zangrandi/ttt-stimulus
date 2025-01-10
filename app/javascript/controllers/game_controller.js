import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = [
    "cell",
    "message", 
    "xPiece", 
    "oPiece", 
    "restartMessage"
  ];

  static values = { token: String };

  connect() {
    super.connect();
    this.startGame();
  }

  startGame() {
    this.currentPlayer = "X"; // Start with player X
    this.selectedPiece = null;
    this.cells = Array.from(this.cellTargets);
    this.updateMessage();
  }

  selectPiece(event) {
    const piece = event.target;

    if (this.currentPlayer === "X" && !piece.classList.contains("piece-x")) {
      return;
    }

    if (this.currentPlayer === "O" && !piece.classList.contains("piece-o")) {
      return;
    }

    this.clearSelection();
    this.selectedPiece = piece;

    if (piece.dataset.piece === 'x')
      piece.classList.add("ring", "ring-offset-2", "ring-blue-500");
    else
      piece.classList.add("ring", "ring-offset-2", "ring-red-500");
  }

  placePiece(event) {
    if (!this.selectedPiece) {
      return;
    }

    const cell = event.target;

    if (cell.textContent !== "" && cell.dataset.size >= this.selectedPiece.dataset.size) {
      return;
    }

    cell.textContent = this.selectedPiece.textContent;

    this.selectedPiece.classList.add("hidden")

    this.stimulate("Game#place_piece", { 
      token: this.tokenValue,
      cell_id: cell.dataset.cellId, 
      size: this.selectedPiece.dataset.size,
      player: this.currentPlayer
    });

    this.selectedPiece = null;

    if (this.checkWin()) {
      this.messageTarget.textContent = `Player ${this.currentPlayer} wins!`;
      this.enableRestart();
      return;
    }

    if (this.checkDraw()) {
      this.messageTarget.textContent = "It's a draw!";
      this.enableRestart();
      return;
    }

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"; // Switch player
    this.updateMessage();
  }

  clearSelection() {
    this.xPieceTargets.concat(this.oPieceTargets).forEach(piece => {
      piece.classList.remove("ring", "ring-offset-2", "ring-blue-500", "ring-red-500");
    });
  }

  updateMessage() {
    this.messageTarget.textContent = `Player ${this.currentPlayer}'s turn:`;
  }

  checkWin() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      if (this.cells[a].textContent === this.currentPlayer &&
             this.cells[a].textContent === this.cells[b].textContent &&
             this.cells[a].textContent === this.cells[c].textContent) {
        this.highlightWinningCells(combination);        
        return true
      }
    });
  }

  highlightWinningCells(combination) {
    combination.forEach(index => {
      const cell = this.cells[index];
      cell.classList.add("winning-cell");
      cell.style.animation = "pop 0.5s ease-in-out";
    });
  }

  checkDraw() {
    return this.cells.every(cell => cell.textContent !== "");
  }

  enableRestart() {
    const target = this.restartMessageTarget;
    target.classList.remove("hidden");
    return;
  }

  disableRestart() {
    const target = this.restartMessageTarget;
    target.classList.add("hidden");
    return;
  }

  restartGame(event) {
    this.clearSelection();

    this.cells.forEach(cell => {
      cell.textContent = ""
      cell.classList.remove("winning-cell")
    });

    this.xPieceTargets.concat(this.oPieceTargets).forEach(piece => {
      piece.classList.remove("hidden");
    });

    this.disableRestart()
    this.startGame()
  }
}
