const WORDS = [
  "APPLE", "BEACH", "BRAIN", "BRAVE", "BREAD", "BRIGHT", "CHAIR", "CHEST", "CLOUD",
  "DANCE", "DRINK", "EARTH", "FLAME", "FRAME", "FRUIT", "GLASS", "GRAPE", "GREEN",
  "HEART", "HOUSE", "LIGHT", "LEMON", "MAGIC", "MONEY", "MOUSE", "MUSIC", "NIGHT",
  "PAINT", "PAPER", "PIZZA", "PLANT", "QUICK", "RIVER", "ROBOT", "SHARK", "SMILE",
  "SPACE", "STONE", "STORY", "SWEET", "TABLE", "TIGER", "TRAIN", "TREEE", "TRUCK",
  "WATER", "WHEEL", "WORLD", "YOUTH", "ZEBRA"
].filter(word => word.length === 5);

const board = document.querySelector("#board");
const keyboard = document.querySelector("#keyboard");
const message = document.querySelector("#message");
const newGameButton = document.querySelector("#new-game");

let answer;
let guesses;
let currentGuess;
let gameOver;

function createBoard() {
  board.innerHTML = "";
  for (let row = 0; row < 6; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let col = 0; col < 5; col++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      rowElement.appendChild(tile);
    }
    board.appendChild(rowElement);
  }
}

function startGame() {
  answer = WORDS[Math.floor(Math.random() * WORDS.length)];
  guesses = [];
  currentGuess = "";
  gameOver = false;
  message.textContent = "";
  createBoard();

  document.querySelectorAll(".keyboard button").forEach(button => {
    button.classList.remove("correct", "present", "absent");
  });
}

function renderGuess() {
  const row = board.children[guesses.length];
  [...row.children].forEach((tile, index) => {
    tile.textContent = currentGuess[index] || "";
    tile.classList.toggle("filled", Boolean(currentGuess[index]));
  });
}

function evaluateGuess() {
  const row = board.children[guesses.length];
  const answerLetters = answer.split("");
  const statuses = Array(5).fill("absent");

  // Mark exact matches first.
  for (let i = 0; i < 5; i++) {
    if (currentGuess[i] === answer[i]) {
      statuses[i] = "correct";
      answerLetters[i] = null;
    }
  }

  // Mark remaining letters that occur elsewhere.
  for (let i = 0; i < 5; i++) {
    if (statuses[i] === "correct") continue;
    const match = answerLetters.indexOf(currentGuess[i]);
    if (match !== -1) {
      statuses[i] = "present";
      answerLetters[match] = null;
    }
  }

  [...row.children].forEach((tile, index) => {
    setTimeout(() => tile.classList.add(statuses[index]), index * 180);
    updateKeyboard(currentGuess[index], statuses[index]);
  });

  guesses.push(currentGuess);

  setTimeout(() => {
    if (currentGuess === answer) {
      message.textContent = "You won!";
      gameOver = true;
    } else if (guesses.length === 6) {
      message.textContent = `The word was ${answer}`;
      gameOver = true;
    }
  }, 900);

  currentGuess = "";
}

function updateKeyboard(letter, status) {
  const key = keyboard.querySelector(`[data-key="${letter}"]`);
  if (!key) return;

  const priority = { absent: 1, present: 2, correct: 3 };
  const current = ["absent", "present", "correct"].find(name => key.classList.contains(name));
  if (!current || priority[status] > priority[current]) {
    key.classList.remove("absent", "present", "correct");
    key.classList.add(status);
  }
}

function handleKey(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    if (currentGuess.length !== 5) {
      message.textContent = "Word must be 5 letters";
      return;
    }
    message.textContent = "";
    evaluateGuess();
  } else if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    renderGuess();
  } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
    currentGuess += key;
    renderGuess();
  }
}

keyboard.addEventListener("click", event => {
  const key = event.target.closest("button")?.dataset.key;
  if (key) handleKey(key);
});

document.addEventListener("keydown", event => {
  const key = event.key === "Enter" ? "ENTER"
    : event.key === "Backspace" ? "BACKSPACE"
    : event.key.toUpperCase();
  handleKey(key);
});

newGameButton.addEventListener("click", startGame);
startGame();
