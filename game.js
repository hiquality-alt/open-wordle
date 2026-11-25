const CREATORS = [
  "hiquality", "pikaapi", "toxic", "j.j.max", "nazmul", "simpy", "korynn",
  "mimoko", "djam", "lilsnapes", "nox", "cardsharkman", "erika", "belittle",
  "axel", "sturmjager", "theramblerman", "blackwidowink", "stargazer",
  "angelclaw", "vibecreai"
];

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
  board.style.setProperty("--word-length", answer.length);
  for (let row = 0; row < 6; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let col = 0; col < answer.length; col++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      rowElement.appendChild(tile);
    }
    board.appendChild(rowElement);
  }
}

function startGame() {
  answer = CREATORS[Math.floor(Math.random() * CREATORS.length)].toUpperCase();
  guesses = [];
  currentGuess = "";
  gameOver = false;
  message.textContent = "";
  createBoard();

  keyboard.querySelectorAll("button").forEach(button => {
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
  const submittedGuess = currentGuess;
  const row = board.children[guesses.length];
  const answerLetters = answer.split("");
  const statuses = Array(submittedGuess.length).fill("absent");

  // Match exact positions first so duplicate letters are scored correctly.
  for (let i = 0; i < submittedGuess.length; i++) {
    if (submittedGuess[i] === answer[i]) {
      statuses[i] = "correct";
      answerLetters[i] = null;
    }
  }

  for (let i = 0; i < submittedGuess.length; i++) {
    if (statuses[i] === "correct") continue;
    const match = answerLetters.indexOf(submittedGuess[i]);
    if (match !== -1) {
      statuses[i] = "present";
      answerLetters[match] = null;
    }
  }

  [...row.children].forEach((tile, index) => {
    setTimeout(() => tile.classList.add(statuses[index]), index * 90);
    updateKeyboard(submittedGuess[index], statuses[index]);
  });

  guesses.push(submittedGuess);
  currentGuess = "";

  setTimeout(() => {
    if (submittedGuess === answer) {
      message.textContent = "You got it!";
      gameOver = true;
    } else if (guesses.length === 6) {
      message.textContent = `The creator was ${answer.toLowerCase()}.`;
      gameOver = true;
    }
  }, answer.length * 90 + 150);
}

function updateKeyboard(character, status) {
  const key = keyboard.querySelector(`[data-key="${character}"]`);
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
    if (currentGuess.length !== answer.length) {
      message.textContent = `Enter a ${answer.length}-character name.`;
      return;
    }
    if (!CREATORS.includes(currentGuess.toLowerCase())) {
      message.textContent = "That name isn't in the creator roster.";
      return;
    }
    message.textContent = "";
    evaluateGuess();
  } else if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    message.textContent = "";
    renderGuess();
  } else if (/^[A-Z.]$/.test(key) && currentGuess.length < answer.length) {
    currentGuess += key;
    message.textContent = "";
    renderGuess();
  }
}

keyboard.addEventListener("click", event => {
  const key = event.target.closest("button")?.dataset.key;
  if (key) handleKey(key);
});

document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleKey("ENTER");
  } else if (event.key === "Backspace") {
    handleKey("BACKSPACE");
  } else if (/^[a-z.]$/i.test(event.key)) {
    handleKey(event.key.toUpperCase());
  }
});

newGameButton.addEventListener("click", startGame);
startGame();
