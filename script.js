// Calling elements
const startbtn = document.getElementById("startbtn");
const quitbtn = document.getElementById("quitebtn");
const heading = document.querySelector(".heading");
const box = document.querySelectorAll(".box");
const restartbtn = document.getElementById("restartbtn");
const runningStatus = document.querySelector(".runningStatus");

// Score Elements
const winEl = document.querySelector("#win span");
const lossEl = document.querySelector("#loss span");
const drawEl = document.querySelector("#draw span");

// Win conditions
const winCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// State
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "x";
let gameActive = false;

// Score variables
let winCount = 0;
let lossCount = 0;
let drawCount = 0;

let continueBtn = document.getElementById("continue-btn");
// Initialize the game
function initializeGame() {
  box.forEach((boxEl) => boxEl.addEventListener("click", boxClicked));
  restartbtn.addEventListener("click", restartGame);
  continueBtn.addEventListener("click", restartGame);
  gameActive = true;
}

// Update running status
function setStatus(message) {
  runningStatus.textContent = message;
}

// Handle box click
function boxClicked() {
  const boxIndex = this.getAttribute("cellIndex");
  if (options[boxIndex] !== "" || !gameActive) {
    return;
  }

  updateBox(this, boxIndex);
  checkWin();
}

// Fill the clicked box
function updateBox(box, index) {
  options[index] = currentPlayer;
  box.textContent = currentPlayer;
}

// Switch player
function changePlayer() {
  currentPlayer = currentPlayer === "x" ? "o" : "x";
}

// Check for win/draw and update score
function checkWin() {
  let roundWon = false;

  for (let i = 0; i < winCondition.length; i++) {
    const [a, b, c] = winCondition[i];
    if (options[a] && options[a] === options[b] && options[a] === options[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    setStatus(`Player ${currentPlayer.toUpperCase()} has won! 🎉`);
    updateScore(currentPlayer === "x" ? "win" : "loss");
    continueBtn.style.display = "block";
    gameActive = false;
  } else if (!options.includes("")) {
    setStatus("It's a draw! 🤝");
    updateScore("draw");
    continueBtn.style.display = "block";
    gameActive = false;
  } else {
    changePlayer();
    setStatus(`Player ${currentPlayer.toUpperCase()}'s turn`);
  }
}

// Update score based on result
function updateScore(result) {
  if (result === "win") {
    winCount++;
    winEl.textContent = winCount.toString().padStart(2, "0");
  } else if (result === "loss") {
    lossCount++;
    lossEl.textContent = lossCount.toString().padStart(2, "0");
  } else if (result === "draw") {
    drawCount++;
    drawEl.textContent = drawCount.toString().padStart(2, "0");
  }
}

// Restart the game board
function restartGame() {
  options = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "x";
  gameActive = true;
  box.forEach((box) => (box.textContent = ""));
  setStatus(`Player ${currentPlayer.toUpperCase()}'s turn`);
  continueBtn.style.display = "none";
}

// Open game screen
const gameContainer = document.getElementById("game-container");
function openGame() {
  gameContainer.style.display = "flex";
  heading.style.display = "none";
  startbtn.style.display = "none";

  initializeGame();
  setStatus(`Player ${currentPlayer.toUpperCase()}'s turn`);
}

// Reload page on quit
function quitGame() {
  location.reload();
}

// Start and quit buttons
startbtn.addEventListener("click", openGame);
quitbtn.addEventListener("click", quitGame);

// keyboard events
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    openGame();
  } else if (e.key === "q") {
    quitGame();
  }
});

// consoling the alert
console.log(document.querySelector(".alert").innerHTML);
