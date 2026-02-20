// CHECKERS GAME



// --------------------
// GENERATE SQUARES  --
//---------------------
function generateSquares(){

  // Board Colors
  let dark = 'rgb(137, 81, 41)';
  let light = 'rgb(240, 218, 181)';

  // Loop - Create 64 squares
  for (let i = 0; i < 64; i++){
    
    // Create square
    const square = document.createElement('div');
    square.classList.add('square');
    
    // Calculate current row and col
    row = Math.floor(i/8) // 0 - 7
    col = i % 8           // 0 - 7

    // Assign attributes
    square.dataset.row = row;
    square.dataset.col = col;
    square.style.backgroundColor = (row + col) % 2  ? dark : light;
    square.contents = null;

    board.appendChild(square);
  }
}

// --------------------
// GENERATE PIECES  --
//---------------------
function generatePieces() {

  // Current row / col
  let row = 2;
  let col = 6;

  // Calculate square
  const square = document.querySelector('.square[data-row="' + row + '"][data-col="' + col + '"]');
  
  // Create piece
  const piece = document.createElement('div');

  // Assign attributes
  piece.classList.add('piece');
  piece.dataset.row = row;
  piece.dataset.col = col;
  piece.square = square;
  piece.style.backgroundColor = 'black';

  // Add piece to square
  square.appendChild(piece);

  // Update square
  square.contents = piece;
}

// -----------
// GLOBALS  --
//------------

const board = document.getElementById('board');
let selectedPiece = null;
const display = document.getElementById('display');

// --------------------------------------------------------------------
//  MAIN

generateSquares();
generatePieces();

function movePiece(piece, destination) {
  destination.appendChild(piece);
  destination.contents = piece;
  piece.dataset.row = destination.dataset.row;
  piece.dataset.col = destination.dataset.col;
}

// ------------------------
// SQUARE INTERACTIVITY  --
//-------------------------
board.addEventListener('click', (e) => {
  const square = e.target.closest('.square');
  if (!square) return;
  // square.style.backgroundColor = 'red';
  if (square.contents != null) {
    selectedPiece = square.contents;
    // alert('Selected piece at: ' + square.dataset.row + ', ' + square.dataset.col);
    display.value = 'Selected: ' + selectedPiece.dataset.row + ', ' + selectedPiece.dataset.col;

  } else if ( selectedPiece != null) {
    movePiece(selectedPiece, square);
    selectedPiece = null;
    display.value = '';
  }

});

