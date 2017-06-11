var min = 5;
var max = 20;
var width = min;
var height = min;
var puzzle = new Array(width*height);
puzzle.fill(false);

function setSize() {
  width = parseInt(document.getElementById("puzzleWidth").value);
  height = parseInt(document.getElementById("puzzleHeight").value);

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
  var clueCount = Math.ceil((Math.max(width, height) / 2));
  var w = width + clueCount;
  var h = height + clueCount;
  var renderObj = {
    containerWidth: w * 22,
    cols: width,
    sectionV1: (width > 5) ? "" + width + "n - " + (width - 5) : "",
    sectionH1: (height > 5) ? "nth-of-type(n + " + ((width * 4) + 1) + "):nth-of-type(-n +" + (width * 5) + ")" : "",
    sectionV2: (width > 10) ? "" + width + "n - " + (width - 10) : "",
    sectionH2: (height > 10) ? "nth-of-type(n + " + ((width * 9) + 1) + "):nth-of-type(-n +" + (width * 10) + ")" : "",
    sectionV3: (width > 15) ? "" + width + "n - " + (width - 15) : "",
    sectionH3: (height > 15) ? "nth-of-type(n + " + ((width * 14) + 1) + "):nth-of-type(-n +" + (width * 15) + ")" : "",
    squares : []
  };
  console.log(renderObj);
  
  for(var i = 0; i < w*h; i++) {
    var r =  Math.floor(i / w);
    var c = (i % h);
    var tag = "puzzle-clue";
    if(r-clueCount > -1 && c-clueCount > -1) {
      tag = "puzzle-cell";
    }
    if(r-clueCount < 0 && c-clueCount < 0) {
      tag = "puzzle-blank";
    }
    renderObj.squares.push({
      class: (puzzle[i]) ? "active" : "",
      row: r-clueCount,
      col: c-clueCount,
      tag: tag,
    });
  }

  var template = document.getElementById("template").innerHTML;
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, renderObj);
  document.getElementById("target").innerHTML = rendered
}