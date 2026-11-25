# Astro's Creator Wordle

A polished, dependency-light browser guessing game featuring Astro's creator roster.

## Play locally

Open `index.html` in a browser, or serve this directory with:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## How to play

Guess the mystery creator in six tries. Every guess must be a name from the roster. A period in `j.j.max` counts as a character.

- **Green:** correct character, correct position
- **Yellow:** character belongs in the name, wrong position
- **Gray:** character is not in the name

The first visit includes a short tutorial. It can be reopened with the `?` button. Use the on-screen or physical keyboard. Press Enter to submit and Backspace to erase.

## Add or remove creators

Open `game.js` and edit the `CREATORS` array near the top:

```javascript
const CREATORS = [
  "hiquality",
  "pikaapi",
  "your-new-creator"
];
```

Keep names in lowercase. Only letters and periods are accepted, and the game automatically adapts the board to the selected name's length.

## License

MIT
