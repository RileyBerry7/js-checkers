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

// ----------------------------------------------------------------------------
// PIECE.KILL --
// -------------
function kill(victim, murderer) {
    const deadSquare = document.createElement('div');
    deadSquare.classList.add('square');
    deadSquare.style.border = 'none';
    movePiece(victim, deadSquare);

    side = (murderer.isMine) ? 'own': 'opponent';
    const sideBoard  = document.getElementById('captured-'+side);
    sideBoard.appendChild(deadSquare);
  
  }

// ----------------------------------------------------------------------------
// FIND CONTENTS --
// ---------------s-
function findContents(location) {
  if (typeof location === "string") alert('String Parameter');
  // Search Document
  const square = document.querySelector(
  `.square[data-row="${location[1]}"][data-col="${location[0]}"]` );
  if (square){
    if (square.contents) { 
      // square.style.backgroundColor = 'red';
    } else {
      // square.style.backgroundColor = 'blue';
    }
    return square.contents;
  } else {
    // alert('Square doesnt exist')
    return null;
  }
}

// ------------------------------------------------------------------------
// IN BOUNDS  --
//--------------
function inBounds(location) {
  if (location[0] < 0 || location[0] > 7) return false;
  if (location[1] < 0 || location[1] > 7) return false;
  return true;
}

// ------------------------------------------------------------------------
// CALCULATE LEGAL MOVES  --  -> returns a set of str: 'col,row'
//--------------------------
function calculateLegalMoves(piece) {  

  let moves    = new Set();
  let captures = new Map();

  let currCol = Number(piece.dataset.col);
  let currRow = Number(piece.dataset.row);

  // -- SIMPLE MOVES -------------------------------------------------------

  // --- Upwards Direction --- //
  if (piece.isKing || piece.isMine) {
    
    // Left Diagonal
    dest = [currCol - 1, currRow - 1];
    if (inBounds(dest)) moves.add(dest.join(','));
    // Check for enemy
    hurdle = findContents(dest);  
    if (hurdle && hurdle.isMine != piece.isMine){
      // Check for double jump
      dest = [currCol - 2, currRow - 2];
      if (inBounds(dest) && !findContents(dest)) {
         captures.set(dest.join(','), hurdle);
      }
    }

    // Right Diagonal
    dest = [currCol + 1, currRow - 1];
    if (inBounds(dest)) moves.add(dest.join(',')); 
    // Check for enemy
    hurdle = findContents(dest);
    if (hurdle && hurdle.isMine != piece.isMine){
      // Check for double jump
      dest = [currCol + 2, currRow - 2];
      if (inBounds(dest) && !findContents(dest)) {
         captures.set(dest.join(','), hurdle);
      }
    }
  }

  // --- Downwards Direction --- //
  if (piece.isKing || !piece.isMine) {

    // Left Diagonal
    dest = [currCol - 1, currRow + 1];
    if (inBounds(dest)) moves.add(dest.join(',')); 
    // Check for enemy
    hurdle = findContents(dest);
    if (hurdle && hurdle.isMine != piece.isMine){
      // Check for double jump
      dest = [currCol - 2, currRow + 2];
      if (inBounds(dest) && !findContents(dest)) {
         captures.set(dest.join(','), hurdle);
      }
    }

    // Right Diagonal
    dest = [currCol + 1, currRow + 1];
    if (inBounds(dest)) moves.add(dest.join(',')); 
    // Check for enemy
    hurdle = findContents(dest);
    if (hurdle && hurdle.isMine != piece.isMine){
      // Check for double jump
      dest = [currCol + 2, currRow + 2];
      if (inBounds(dest) && !findContents(dest)) {
         captures.set(dest.join(','), hurdle);
      }
    }
  }

// RETURN - MoveSet, or CaptureSet if non-empty
return (captures.size == 0) ? moves : captures;
}

// --------------------------------------------------------------------------
// ATTEMPT MOVE  --
//-----------------
function attemptMove(piece, destination) {

  // Calculate Set of Legal Moves
  const moveSet = calculateLegalMoves(piece); // Set | Map : ('col,row')
  
  // Target location -> str: 'col,row'
  target = destination.dataset.col + ',' + destination.dataset.row;

  // -- CAPTURE MOVE (Double Jump) --------------------------------------------
  if (moveSet instanceof Map){

    // Target must be in capture set
    // --> If capture is possible, any non-capture move is illegal.
    if (!moveSet.has(target)) return false;
    
    // Piece being captured
    victim = moveSet.get(target);
    // victim.style.backgroundColor = 'blue';
    kill(victim, piece);   // removes from board
    return true;          // move success 

  // -- NORMAL MOVE (Single Jump) ---------------------------------------------
  } else if (moveSet.has(target)) {
    return true;
  
  // -- ILLEGAL MOVE ----------------------------------------------------------
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
      if (attemptMove(selectedPiece, square)) {
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

