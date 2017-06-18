var min = 5;
var max = 20;
var width = min;
var height = min;
var puzzle = new Array(width*height);
puzzle.fill(false);

function setSize() {
  width = parseInt(document.getElementById('puzzleWidth').value);
  height = parseInt(document.getElementById('puzzleHeight').value);

  puzzle = new Array(width * height);
  puzzle.fill(false);
  console.log('Width: ', width);
  console.log('Height: ', height);
  console.log('Puzzle', puzzle);
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
    console.log('Invalid row, col');
    return; 
  } 

  puzzle[idx] = !puzzle[idx];
  renderPuzzle();
}

function renderPuzzle() {
  var colCluesCount = Math.ceil(width / 2);
  var rowCluesCount = Math.ceil(height / 2);
  var colClues = new Array(colCluesCount * width);
  colClues.fill(undefined);
  var rowClues = new Array(rowCluesCount *height);
  rowClues.fill(undefined);
  var w = width + colCluesCount;
  var h = height + rowCluesCount;
  var renderObj = {
    containerWidth: w * 20,
    cols: width,
    sectionV1: (width > 5) ? '' + width + 'n - ' + (width - 5) : '',
    sectionH1: (height > 5) ? 'nth-of-type(n + ' + ((width * 4) + 1) + '):nth-of-type(-n +' + (width * 5) + ')' : '',
    sectionV2: (width > 10) ? '' + width + 'n - ' + (width - 10) : '',
    sectionH2: (height > 10) ? 'nth-of-type(n + ' + ((width * 9) + 1) + '):nth-of-type(-n +' + (width * 10) + ')' : '',
    sectionV3: (width > 15) ? '' + width + 'n - ' + (width - 15) : '',
    sectionH3: (height > 15) ? 'nth-of-type(n + ' + ((width * 14) + 1) + '):nth-of-type(-n +' + (width * 15) + ')' : '',
    squares : []
  };
  
  // Column Clues
  for(var i = 0; i < width; i++) {
    var idx = i * colCluesCount;
    var clueVal = 0;
    for(var j = i; j < puzzle.length; j += width) {
      if(puzzle[j]) {
        clueVal++;
      } else {
        if(clueVal > 0) {
          colClues[idx] = clueVal;
          idx++;
          clueVal = 0;
        }
      }
    }
    if(clueVal > 0) {
      colClues[idx] = clueVal;
    }
  }

  // Row Clues
  for(var i = 0; i < height; i++) {
    var idx = i * rowCluesCount;
    var clueVal = 0;
    var start = i * width;
    for(var j = start; j < (start + width); j++) {
      if(puzzle[j]) {
        clueVal++;
      } else {
        if(clueVal > 0) {
          rowClues[idx] = clueVal;
          idx++;
          clueVal = 0;
        }
      }
    }

    if(clueVal > 0) {
      rowClues[idx] = clueVal;
    }
  }

  for(var i = 0; i < w*h; i++) {
    var r =  Math.floor(i / w);
    var c = (i % w);
    var tag = 'puzzle-clue';
    var val = '';
    var activeClass = '';
    if(r-rowCluesCount > -1 && c-colCluesCount > -1) {
      tag = 'puzzle-cell';
      var idx = (r-rowCluesCount) * width + (c-colCluesCount);
      if(puzzle[idx]) {
        activeClass = 'active';
      }
    } else if(r-rowCluesCount < 0 && c-colCluesCount < 0) {
      tag = 'puzzle-blank';
    } else {
      var clueR = 0;
      var clueC = 0;
      if(r < rowCluesCount) {
        clueC = c-colCluesCount;
        clueR = rowCluesCount-(r+1);
        if(colClues[clueC*colCluesCount+clueR] != undefined) {
          val = colClues[clueC*colCluesCount+clueR];
        }
      } else {
        clueR = r-rowCluesCount;
        clueC = colCluesCount-(c+1);
        if(rowClues[clueR*rowCluesCount+clueC] != undefined) {
          val = rowClues[clueR*rowCluesCount+clueC];
        }
      }
    }

    renderObj.squares.push({
      class: activeClass,
      row: r-rowCluesCount,
      col: c-colCluesCount,
      tag: tag,
      val: val
    });
  }

  var template = document.getElementById('template').innerHTML;
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, renderObj);
  document.getElementById('target').innerHTML = rendered;
}