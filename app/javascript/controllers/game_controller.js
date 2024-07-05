import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "cell",
    "message", 
    "xPiece", 
    "oPiece", 
    "restartMessage"
  ];

  connect() {
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
    piece.classList.add("ring", "ring-offset-2", "ring-blue-500");
  }

  placePiece(event) {
    if (!this.selectedPiece) {
      return; // No piece selected
    }

    const cell = event.target;

    if (cell.textContent !== "") {
      return; // Cell already played
    }

    cell.textContent = this.selectedPiece.textContent;
    cell.classList.add(this.currentPlayer === "X" ? "text-blue-700" : "text-red-700");

    this.selectedPiece.classList.add("hidden")
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
      piece.classList.remove("ring", "ring-offset-2", "ring-blue-500");
    });
  }

  updateMessage() {
    this.messageTarget.textContent = `Player ${this.currentPlayer}'s turn:`;
  }

  checkWin() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 4], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return this.cells[a].textContent === this.currentPlayer &&
             this.cells[a].textContent === this.cells[b].textContent &&
             this.cells[a].textContent === this.cells[c].textContent;
    });
  }

  checkDraw() {
    return this.cells.every(cell => cell.textContent !== "");
  }

  enableRestart() {
    const target = this.restartMessageTarget;
    target.textContent = "Restart";
  }

  restartGame() {
    const elements = document.querySelectorAll('.cell');
    elements.forEach(element => {
      element.classList.remove('hidden');
    });
  }
}
