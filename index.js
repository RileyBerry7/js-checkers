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
    square.color = (row + col) % 2  ? 'dark' : 'light';
    square.contents = null;

    board.appendChild(square);
  }
}

// --------------------
// GENERATE PIECES  --
//---------------------
function generatePieces() {

let initialBoard = [[0, 'white'], [1, 'white'], [2, 'white'],     
                   [5, 'black'], [6, 'black'], [7, 'black']];

  for (const [row, color] of initialBoard) {
    for (let col = 0; col < 8; col++) {

      // Calculate square
      const square = document.querySelector('.square[data-row="' + row + '"][data-col="' + col + '"]');
      if (square.color == 'light') continue; // Skip light squares
      
      // Create piece
      const piece = document.createElement('div');

      // Assign attributes
      piece.classList.add('piece');
      piece.dataset.row = row;
      piece.dataset.col = col;
      piece.square = square;
      piece.style.backgroundColor = color;

      // Add piece to square
      square.appendChild(piece);

      // Update square
      square.contents = piece;
    }
  }
} 

// --------------
// MOVE PIECE  --
//---------------
function movePiece(piece, destination) {
  piece.square.contents = null;
  piece.square = destination;
  destination.appendChild(piece);
  destination.contents = piece;
  piece.dataset.row = destination.dataset.row;
  piece.dataset.col = destination.dataset.col;
}

// ------------------
// CHECK LEGALITY  --
//-------------------
function checkLegalMove(piece, destination) {
  // Assuming all the pieces are men(unpromoted)
  let rowDiff = Number(destination.dataset.row) - Number(piece.dataset.row);
  let colDiff = Number(destination.dataset.col) - Number(piece.dataset.col);
  
  // Standard Move
  if (Math.abs(colDiff) == 1 && Math.abs(rowDiff) == 1) {
    return true;
  
    // Jump/Capture Move
  } else if (Math.abs(colDiff) == 2 && Math.abs(rowDiff) == 2) {
    row = Number(piece.dataset.row) + rowDiff/2;
    col = Number(piece.dataset.col) + colDiff/2;

    const square = document.querySelector('.square[data-row="' + row + '"][data-col="' + col + '"]');
    if (square.contents == null){
      return false;
    };
    square.contents.style.backgroundColor = 'red';
    return true;        

  } else {
    return false;
  } 
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



// ------------------------
// SQUARE INTERACTIVITY  --
//-------------------------
board.addEventListener('click', (e) => {
  const square = e.target.closest('.square');
  
  // ERROR CHECKING
  if (!square) return;
  
  // If square occupied
  if (square.contents != null) {
    selectedPiece = square.contents;
    display.value = 'Selected: ' + selectedPiece.dataset.row + ', ' + selectedPiece.dataset.col;

  // If square empty & something selected
  } else if ( selectedPiece != null) {
      // Check Legality
      if (checkLegalMove(selectedPiece, square)) {
        movePiece(selectedPiece, square);
      } else {
        alert('Illegal Move!');
      }
    // Clear selection
    selectedPiece = null;
    display.value = '';
  }

});

