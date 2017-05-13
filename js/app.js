function loadUser() {
  var template = document.getElementById("template").innerHTML;
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, {name: "Luke"});
  document.getElementById("target").innerHTML = rendered
}

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
}

function minMaxCheck(object) {
  if(object.value > max){
    object.value = max;
  }
  if(object.value < min) {
    object.value = min;
  }
}

function selectItem(row, col) {

}

function renderPuzzle() {
  console.log("Rendering puzzle");
}