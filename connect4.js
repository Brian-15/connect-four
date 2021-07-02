/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = new Array(WIDTH).fill(null);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  // create column top variable
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // create top row element and append to htmlBoard
  // these are empty spaces above the grid where we drop the coins
  for (var x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create grid row and td elements
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  if (x < 0 || x >= WIDTH) throw new Error('x coordinate out of bounds');

  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`player${currPlayer}`);
  document.getElementById(`${y}-${x}`).appendChild(piece);
}

/** endGame: announce game end */

function endGame(msg) {

  // add start button again
  setupMenu();

  // pop up alert message
  window.alert(msg);

  // reset board
  emptyPieces();

  // remove tracker if present
  const tracker = document.getElementById('tracker');
  if (tracker !== null) tracker.remove();
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if(!start) return;

  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // update in-memory board
  board[y][x] = currPlayer;

  // place piece in board and add to HTML table
  placeInTable(y, x);


  // check for win
  if (checkForWin()) {
    // stop handleClick before timeout
    start = false;
    // due to the timeout, currPlayer will have switched already
    // hence, the current player will be stored before that happens
    const player = currPlayer;
    setTimeout(() => endGame(`Player ${player} won!`), 200);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (checkForTie()) {
    // stop handleClick before timeout
    start = false;
    setTimeout(() => endGame('Tie. No players win.'), 200);
  }

  // switch players
  const tracker = document.getElementById('tracker');
  tracker.lastChild.classList.toggle(`player${currPlayer}`);

  // switch currPlayer 1 <-> 2
  currPlayer = (currPlayer === 1)? 2: 1;

  // update player tracker
  tracker.firstChild.innerText = `Player ${currPlayer}`;
  tracker.lastChild.classList.toggle(`player${currPlayer}`);
}

/** checkForTie: check that all cells have a piece in them */

function checkForTie() {
  return board.every(row => row.every(cell => cell !== null));
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // check if 4 pieces of the same color are connected for every x and y
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz =   [[y, x], [y, x + 1],     [y, x + 2],     [y, x + 3]];
      const vert =    [[y, x], [y + 1, x],     [y + 2, x],     [y + 3, x]];
      const diagDR =  [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL =  [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

let start = false;

function setupMenu() {
  const startButton = document.createElement('div');
  
  //startButton.type = 'button';
  startButton.innerText = 'START';
  startButton.id = 'start';

  startButton.addEventListener('click', (evt) => {
    start = true;
    evt.target.remove();
    displayCurrentPlayer();
  });

  document.getElementById('menu').appendChild(startButton);
}

// delete all pieces from the board
function emptyPieces() {
  const pieces = document.querySelectorAll('#board .piece')
  if (pieces.length > 0) pieces.forEach(piece => piece.remove());
  makeBoard();
}

// make player turn tracker
function displayCurrentPlayer() {
  const tracker = document.createElement('div');
  tracker.id = 'tracker';
  
  // display player name
  const displayName = document.createElement('text');
  displayName.innerText = 'Player 1';
  displayName.id = 'current-player';

  // display player piece with color
  const piece = document.createElement('div');
  piece.id = 'display-piece';
  piece.classList.add('piece', 'player1');

  tracker.appendChild(displayName);
  tracker.appendChild(piece);

  document.getElementById('menu').appendChild(tracker);
}


makeBoard();
makeHtmlBoard();
