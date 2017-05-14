var min = 5;
var max = 20;
var width = min;
var height = min;
var puzzle = new Array(width*height);
puzzle.fill(false);

function setSize() {
  width = document.getElementById("width").value;
  height = document.getElementById("height").value;

  puzzle = new Array(width * height);
  puzzle.fill(false);
  console.log("Width: ", width);
  console.log("Height: ", height);
  console.log("Puzzle", puzzle);
  renderPuzzle();
}

function minMaxCheck(object) {
  if(object.value > max){
    object.value = max;
  }
  if(object.value < min) {
    object.value = min;
  }
}

function toggleItem(row, col) {
  var idx = row * width + col;
  if(idx >= puzzle.length || idx < 0) {
    console.log("Invalid row, col")
    return 
  } 

  puzzle[idx] = !puzzle[idx];
  renderPuzzle();
}

function renderPuzzle() {
  var renderObj = {
    containerWidth: width * 22,
    topSel: width+1,
    leftSel: width,
    squares : []
  };
  for(var i = 0; i < width*height; i++) {
    renderObj.squares.push({
      class: (puzzle[i]) ? "active" : "",
      row: Math.floor(i / width),
      col: (i % width)
    });
  }

  var template = document.getElementById("template").innerHTML;
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, renderObj);
  document.getElementById("target").innerHTML = rendered
}