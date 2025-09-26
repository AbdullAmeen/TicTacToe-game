// Calling elements
const startbtn = document.getElementById("startbtn");
const playWithComputerBtn = document.querySelector("#playwithcomputer");

const quitbtn = document.getElementById("quitebtn");
const heading = document.querySelector(".heading");
const box = document.querySelectorAll(".box");
const restartbtn = document.getElementById("restartbtn");
const runningStatus = document.querySelector(".runningStatus");

// Score Elements
const winEl = document.querySelector("#win span");
const lossEl = document.querySelector("#loss span");
const drawEl = document.querySelector("#draw span");

const gameContainer = document.getElementById("game-container");

let isComputerMode = false;

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
  box.forEach((boxEl) => {
    boxEl.removeEventListener("click", boxClickedCom);
    boxEl.removeEventListener("click", boxClicked);
    boxEl.addEventListener("click", boxClicked);
  });
  restartbtn.addEventListener("click", restartGame);
  continueBtn.addEventListener("click", restartGame);
  gameActive = true;
}

// Initialize computer game
function initializeComGame() {
  box.forEach((boxEl) => {
    boxEl.removeEventListener("click", boxClicked);
    boxEl.removeEventListener("click", boxClickedCom);
    boxEl.addEventListener("click", boxClickedCom);
  });
  restartbtn.addEventListener("click", restartGame);
  continueBtn.addEventListener("click", restartGame);
  gameActive = true;
}

function boxClickedCom() {
  const boxIndex = Array.from(box).indexOf(this);
  if (options[boxIndex] !== "" || !gameActive) return;
  updateBox(this, boxIndex);
  checkWin();
  if (gameActive) {
    setTimeout(makeComputerMove, 400); // Delay for realism
  }
}

function makeComputerMove() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];

  // 1. Try to win
  for (let [a, b, c] of winPatterns) {
    if (options[a] === "o" && options[b] === "o" && options[c] === "") return playMove(c);
    if (options[a] === "o" && options[c] === "o" && options[b] === "") return playMove(b);
    if (options[b] === "o" && options[c] === "o" && options[a] === "") return playMove(a);
  }

  // 2. Block opponent
  for (let [a, b, c] of winPatterns) {
    if (options[a] === "x" && options[b] === "x" && options[c] === "") return playMove(c);
    if (options[a] === "x" && options[c] === "x" && options[b] === "") return playMove(b);
    if (options[b] === "x" && options[c] === "x" && options[a] === "") return playMove(a);
  }

  let randomBool = Math.random() > 0.5;
  if(randomBool){
    // 3. Take center
    if (options[4] === "") return playMove(4);
  }else{
    // 4. Take a corner
    for (let i of [0, 2, 6, 8]) {
      if (options[i] === "") return playMove(i);
    }
  }

  // 5. Otherwise random
  const availableBoxes = [];
  for (let i = 0; i < options.length; i++) {
    if (options[i] === "") availableBoxes.push(i);
  }
  if (availableBoxes.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableBoxes.length);
    return playMove(availableBoxes[randomIndex]);
  }

  function playMove(index) {
    updateBox(box[index], index, "o");
    checkWin();
  }
}


// Add this function for player-vs-player mode
function boxClicked() {
  const boxIndex = Array.from(box).indexOf(this);
  if (options[boxIndex] !== "" || !gameActive) return;
  updateBox(this, boxIndex);
  checkWin();
}

// Open computer game screen
function openComGame(e) {
  isComputerMode = true;
  gameContainer.style.display = "flex";
  heading.style.display = "none";
  startbtn.style.display = "none";
  playWithComputerBtn.style.display = "none";

  initializeComGame(); // Call the correct function
  setStatus(`(${currentPlayer.toUpperCase()}) your turn`);
}

//update score fundtion
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

// Update running status
function setStatus(message) {
  runningStatus.textContent = message;
}

// Fill the clicked box
function updateBox(box, index, player = currentPlayer) {
  options[index] = player;
  box.textContent = player;
}

// Switch player
function changePlayer() {
  currentPlayer = currentPlayer === "x" ? "o" : "x";
}

function checkWin() {
  let roundWon = false;
  let winnerIndex = null;

  for (let i = 0; i < winCondition.length; i++) {
    const [a, b, c] = winCondition[i];
    if (options[a] && options[a] === options[b] && options[a] === options[c]) {
      roundWon = true;
      winnerIndex = a;
      break;
    }
  }

  if (roundWon) {
    let resultMessage = "";
    const winnerSymbol = options[winnerIndex];

    if (isComputerMode) {
      resultMessage = winnerSymbol === "x" ? "You win!" : "Computer wins!";
      updateScore(winnerSymbol === "x" ? "win" : "loss");
    } else {
      resultMessage = `Player ${winnerSymbol.toUpperCase()} wins!🎉`;
      updateScore(winnerSymbol === "x" ? "win" : "loss");
    }

    setStatus(resultMessage);
    continueBtn.style.display = "block";
    if ((continueBtn.style.display = "block")) {
      const board = document.querySelector(".board");
      board.style.filter = "blur(4px)";
      board.style.pointerEvents = "none";
      document.body.addEventListener("keyup", (e) => {});
    }
    gameActive = false;
  } else if (!options.includes("")) {
    setStatus("It's a draw! ");
    updateScore("draw");
    continueBtn.style.display = "block";
    if ((continueBtn.style.display = "block")) {
      const board = document.querySelector(".board");
      board.style.filter = "blur(4px)";
      board.style.pointerEvents = "none";
    }
    gameActive = false;
  } else {
    changePlayer();
    if (isComputerMode) {
      setStatus(currentPlayer === "x" ? "Your move" : "Computer's move");
    } else {
      setStatus(`Player ${currentPlayer.toUpperCase()}'s turn`);
    }
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
  if ((continueBtn.style.display = "none")) {
    const board = document.querySelector(".board");
    board.style.filter = "blur(0px)";
    board.style.pointerEvents = "auto";
  }

  // Remove all listeners, then re-initialize based on mode
  box.forEach((boxEl) => {
    boxEl.removeEventListener("click", boxClicked);
    boxEl.removeEventListener("click", boxClickedCom);
  });

  if (isComputerMode) {
    initializeComGame();
    setStatus("Your move");
  } else {
    initializeGame();
    setStatus(`Player ${currentPlayer.toUpperCase()}'s turn`);
  }
}

// Open friend game screen
function openGame() {
  isComputerMode = false;
  gameContainer.style.display = "flex";
  heading.style.display = "none";
  startbtn.style.display = "none";
  playWithComputerBtn.style.display = "none";

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
playWithComputerBtn.addEventListener("click", openComGame);

// keyboard events
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    openGame();
  } else if (e.key === "q") {
    quitGame();
  } else if (e.key === "c") {
    openComGame();
  }
});

// consoling the alert
console.log(document.querySelector(".alert").innerHTML);

const theme = document.getElementById("theme");
const themeChoice = document.getElementById("theme-choice");
const themeChoiceBtn = document.querySelectorAll("#theme-choice p");

theme.addEventListener("click", () => {
  themeChoice.classList.toggle("active");
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.classList.add(savedTheme);
}

themeChoiceBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "dark-theme") {
      document.body.className = "dark";
      localStorage.setItem("theme", "dark");
      themeChoice.classList.toggle("active");
    } 
    else if (btn.id === "default-theme") {
      document.body.className = "default";
      localStorage.setItem("theme", "default");
      themeChoice.classList.toggle("active");
    }
    else if (btn.id === "gradient-theme") {
      document.body.className = "gradient";
      localStorage.setItem("theme", "gradient");
      themeChoice.classList.toggle("active");
    }
  });
});
