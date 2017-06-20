var min = 5;
var max = 20;
var width = min;
var height = min;
var puzzle = new Array(width*height);
puzzle.fill(false);
puzzleFromCode();

function stringifyPuzzle(puzzle) {
  var currentCharCode = 0;
  var puzzleStr = width + ',' + height + ':';
  for(var i = 0; i < puzzle.length; i++) {
    var puzzleBit = 0;
    if(puzzle[i]) { 
      puzzleBit = 1;
    }
    var bitIndex = i % 8;
    currentCharCode |= (puzzleBit << bitIndex);
    if(i > 0 && i % 8 == 0) {
      var char = String.fromCharCode(currentCharCode);
      puzzleStr += char;
      currentCharCode = 0;
    }
  }

  return puzzleStr;
}

function puzzleFromCode(code) {
  code = 'NSw1OkEREA==';
  var decoded = atob(code);
  var components = decoded.split(':');
  if(components.length != 2) {
    console.error('Invalid code:', code);
    return;
  }
  var header = components[0];
  var headerComponents = header.split(',');
  if(headerComponents.length != 2) {
    console.error('Invalid header in code:', code);
    return;
  }
  var w = parseInt(headerComponents[0]);
  if(isNaN(w)) {
    console.error('Invalid width value in code:', code);
    return;
  }
  var h = parseInt(headerComponents[1]);
  if(isNaN(h)) {
    console.error('Invalid height value in code:', code);
    return;
  }

  var puzzleData = components[1];
  // if(puzzleData.length < ((w * h) / 8)) {
  //   console.error('Invalid puzzle data length:', puzzleData.length, 'for w:', w, 'h:', h, 'in code:', code);
  //   return;
  // }

  var newPuzzle = new Array(w*h);
  newPuzzle.fill(false);
  for(var i = 0; i < puzzleData.length; i++) {
    var char = puzzleData[i];
    var charCode = char.charCodeAt(0);
    for(var j = 0; j < 8; j++) {
      var mask = 1 << j;
      console.log(mask.toString(2));
      newPuzzle[(i*8+j)] = (charCode & mask) != 0;
    }
  }

  width = w;
  height = h;
  puzzle = newPuzzle;
}

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
    squares : [],
    puzzleVal: btoa(stringifyPuzzle(puzzle))
  };
  
  // Column Clues
  for(var i = 0; i < width; i++) {
    var idx = i * colCluesCount;
    var clues = [];
    var clueVal = 0;
    for(var j = i; j < puzzle.length; j += width) {
      if(puzzle[j]) {
        clueVal++;
      } else {
        if(clueVal > 0) {
          clues.unshift(clueVal);
          clueVal = 0;
        }
      }
    }
    if(clueVal > 0) {
      clues.unshift(clueVal);
    }
    for(var j = 0; j < clues.length; j++) {
      colClues[idx+j] = clues[j];
    }
  }

  // Row Clues
  for(var i = 0; i < height; i++) {
    var idx = i * rowCluesCount;
    var clues = [];
    var clueVal = 0;
    var start = i * width;
    for(var j = start; j < (start + width); j++) {
      if(puzzle[j]) {
        clueVal++;
      } else {
        if(clueVal > 0) {
          clues.unshift(clueVal);
          clueVal = 0;
        }
      }
    }

    if(clueVal > 0) {
      clues.unshift(clueVal);
    }

    for(var j = 0; j < clues.length; j++) {
      rowClues[idx+j] = clues[j];
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