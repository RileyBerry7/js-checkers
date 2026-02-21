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

let initialBoard = [[0, opColor], [1, opColor], [2, opColor],
                   [5, myColor], [6, myColor], [7, myColor]];

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

      piece.isMine = (color == myColor) ? true : false;
      piece.isKing = false;

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

  // Check for Promotion
  if (!piece.isKing && piece.dataset.row == 0 || piece.dataset.row == 7) {
    piece.isKing = true;
    const crown = document.createElement('div');
    crown.classList.add('piece');
    crown.style.backgroundColor = 'rgb(255, 215, 0)'; // Gold
    crown.style.width = '50%';
    crown.style.height = '50%';
    piece.appendChild(crown);
    
  }
}

// ------------------
// CHECK LEGALITY  --
//-------------------
function checkLegalMove(piece, destination) {
  // Assuming all the pieces are unpromoted
  let rowDiff = Number(destination.dataset.row) - Number(piece.dataset.row);
  let colDiff = Number(destination.dataset.col) - Number(piece.dataset.col);
  
  // Row diff will always be positive
  if (piece.style.backgroundColor == myColor) rowDiff *= -1;

  // Standard Move
  if (Math.abs(colDiff) == 1 && rowDiff == 1) {
    return true;
  
    // Jump/Capture Move
  } else if (Math.abs(colDiff) == 2 && rowDiff == 2) {
    
    row = Number(piece.dataset.row);
    row += (piece.isMine) ? -rowDiff/2 : (rowDiff)/2;
    col = Number(piece.dataset.col) + colDiff/2;

    const jumpedSquare = document.querySelector('.square[data-row="' + row + '"][data-col="' + col + '"]');
    if (jumpedSquare.contents == null){
      return false;
    }

    if (jumpedSquare.contents.isMine == piece.isMine) {
      return false;
    }
    
    const deadSquare = document.createElement('div');
    deadSquare.classList.add('square');
    deadSquare.style.border = 'none';
    movePiece(jumpedSquare.contents, deadSquare);

    side = (piece.isMine) ? 'own': 'opponent';
    const sideBoard  = document.getElementById('captured-'+side);
    sideBoard.appendChild(deadSquare);
    return true;        

  } else {
    return false;
  } 
}

// -----------
// GLOBALS  --
//------------

const board = document.getElementById('board');
const display = document.getElementById('display');

const myColor = 'white';
const opColor = 'black';

let selectedPiece = null;

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
      
    // Check for legal move
      if (checkLegalMove(selectedPiece, square)) {
        // Execute move
        movePiece(selectedPiece, square);
        display.value = '';

      // Illegal Move
      } else {
        display.value = 'Illegal Move!';
      }

    // Clear selection
    selectedPiece = null;
  }

});

