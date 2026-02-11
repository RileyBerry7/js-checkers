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

function generateSquares(){

  const board = document.getElementById('board');

  for (let i = 0; i < 64; i++){
    const square = document.createElement('div');
    square.classList.add('square');
    // row = Math.floor(i / 8);
    // square.style.backgroundColor = ( !(row%2 && i%2) || i%2 ) ? 'white' : 'black';

    square.style.backgroundColor = 'rgb('+ i/64*255 +', 50, 200)';
    
    // Color Even rows
    if (Math.floor(i/8) % 2){
      square.style.backgroundColor = i%2  ? 'white' : 'black';
    
    // Color odd row
    } else {
      square.style.backgroundColor = (i%2)  ? 'black' : 'white';
    }

    board.appendChild(square);
  }
}

generateSquares();
