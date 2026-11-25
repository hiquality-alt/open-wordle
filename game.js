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
const helpButton = document.querySelector("#help-button");
const tutorial = document.querySelector("#tutorial");
const closeTutorial = document.querySelector("#close-tutorial");
const playButton = document.querySelector("#play-button");

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

function showMessage(text) {
  message.textContent = text;
  message.classList.remove("pop");
  void message.offsetWidth;
  message.classList.add("pop");
}

function evaluateGuess() {
  const submittedGuess = currentGuess;
  const row = board.children[guesses.length];
  const answerLetters = answer.split("");
  const statuses = Array(submittedGuess.length).fill("absent");

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
    setTimeout(() => {
      tile.classList.add("reveal", statuses[index]);
      updateKeyboard(submittedGuess[index], statuses[index]);
    }, index * 130);
  });

  guesses.push(submittedGuess);
  currentGuess = "";

  setTimeout(() => {
    if (submittedGuess === answer) {
      showMessage("You got it! ✨");
      gameOver = true;
      [...row.children].forEach((tile, index) => {
        setTimeout(() => tile.animate(
          [{ transform: "translateY(0)" }, { transform: "translateY(-10px)" }, { transform: "translateY(0)" }],
          { duration: 280, easing: "ease-out" }
        ), index * 80);
      });
    } else if (guesses.length === 6) {
      showMessage(`The creator was ${answer.toLowerCase()}`);
      gameOver = true;
    }
  }, submittedGuess.length * 130 + 420);
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

function shakeCurrentRow() {
  const row = board.children[guesses.length];
  row.classList.remove("shake");
  void row.offsetWidth;
  row.classList.add("shake");
}

function handleKey(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    if (currentGuess.length !== answer.length) {
      showMessage(`Enter a ${answer.length}-character name`);
      shakeCurrentRow();
      return;
    }
    if (!CREATORS.includes(currentGuess.toLowerCase())) {
      showMessage("That name isn't in the creator roster");
      shakeCurrentRow();
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

function closeTutorialModal() {
  tutorial.classList.add("hidden");
  try { localStorage.setItem("creatorWordleTutorialSeen", "true"); } catch (_) {}
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
helpButton.addEventListener("click", () => tutorial.classList.remove("hidden"));
closeTutorial.addEventListener("click", closeTutorialModal);
playButton.addEventListener("click", closeTutorialModal);
tutorial.addEventListener("click", event => {
  if (event.target === tutorial) closeTutorialModal();
});

let tutorialSeen = false;
try { tutorialSeen = localStorage.getItem("creatorWordleTutorialSeen") === "true"; } catch (_) {}
if (!tutorialSeen) tutorial.classList.remove("hidden");

startGame();
