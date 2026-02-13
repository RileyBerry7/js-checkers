// CALCULATOR PROGRAM

const display = document.getElementById('display');

function appendTo(input){
  display.value += input;
}

function clearDisplay(){
  display.value = '';
}


function calculate(){
  try {
    display.value = eval(display.value);
  } catch(error) {
    display.value = 'Error';
  }
}

// --------------------------------------------------------------------
//  MAIN

const board = document.getElementById('board');

// --------------------
// GENERATE SQUARES  --
//---------------------
function generateSquares(){

  // Board Colors
  let dark = 'rgb(137, 81, 41)';
  let light = 'rgb(240, 218, 181)';

  // Loop through every square
  for (let i = 0; i < 64; i++){
    
    // Create square as a div
    const square = document.createElement('div');
    square.classList.add('square');
    
    // Calculate row / col
    row = Math.floor(i/8) // 0 - 7
    col = i % 8           // 0 - 7

    // Assign row / col
    square.dataset.row = row;
    square.dataset.col = col;

    // Assign color accordingly
    square.style.backgroundColor = (row + col) % 2  ? dark : light;

    board.appendChild(square);
  }
}

generateSquares();

// Add square interactivity
board.addEventListener('click', (e) => {
  const square = e.target.closest('.square');
  if (!square) return;
  // alert('Square clicked: ', square.dataset.index);
  square.style.backgroundColor = 'red';
});
