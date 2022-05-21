const overlay = document.getElementById("overlay");
const notification = document.getElementById("notification");
const gridView = document.getElementById("grid");

// *************************** Fetching The Dictionary ****************************//
var jsonData = [];
fetch("./scripts/word.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    jsonData = data;
    frontEndGridGenerator();
  });
document.getElementById("submit").onclick = checkWord;

overlay.onclick = function () {
  overlay.classList.add("hidden");
};
var alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

//************************Point Calculation********************//
var keyStroke = 0;


//**********************Filling Up Grid*******************************
var grid = [];
var generatedGrid = [];
var visited = [];
var generatedGrid = [];
var rows = 5;
var cols = 5;
function gridGeneratorHelper(i, j, word, k) {
  var ans;
  if (k == word.length) {
    return true;
  }
  if (i < 0 || i >= 5 || j < 0 || j >= 5) return false;
  if (generatedGrid[i][j] == word[k]) {
    ans =
      gridGeneratorHelper(i + 1, j, word, k + 1) ||
      gridGeneratorHelper(i - 1, j, word, k + 1) ||
      gridGeneratorHelper(i, j + 1, word, k + 1) ||
      gridGeneratorHelper(i, j - 1, word, k + 1);
  }
  if (visited[i][j] != 0) {
    return false;
  }
  generatedGrid[i][j] = word[k];
  visited[i][j] = 1;
  ans =
    gridGeneratorHelper(i + 1, j, word, k + 1) ||
    gridGeneratorHelper(i - 1, j, word, k + 1) ||
    gridGeneratorHelper(i, j + 1, word, k + 1) ||
    gridGeneratorHelper(i, j - 1, word, k + 1);
  visited[i][j] = 0;
  return ans;
}

function putWordInGrid(word) {
  var index_i = Math.floor(Math.random() * 5);
  var index_j = Math.floor(Math.random() * 5);
  return gridGeneratorHelper(index_i, index_j, word, 0);
}

function generateGrid() {
  //var matrix = [];
  for (var i = 0; i < rows; ++i) {
    var matrix1 = [];
    var matrix2 = [];
    for (var j = 0; j < cols; ++j) {
      matrix1.push("*");
      matrix2.push(0);
    }
    generatedGrid.push(matrix1);
    visited.push(matrix2);
  }
  var i = 0;
  console.log(jsonData.words);
  while (i <= 3) {
    var random_index = Math.floor(Math.random() * 2285);
    var word = jsonData.words[random_index];
    if (putWordInGrid(word.toUpperCase())) {
      i = i + 1;
    }
  }
  for (var i = 0; i < 5; ++i) {
    for (var j = 0; j < 5; ++j) {
      if (generatedGrid[i][j] == "*") {
        generatedGrid[i][j] = alphabet[Math.floor(Math.random() * 26)];
      }
    }
  }
}

function frontEndGridGenerator() {
  console.log(jsonData.words);
  generateGrid();
  for (let i = 0; i < 5; ++i) {
    var row = [];
    for (let j = 0; j < 5; ++j) {
      var box = document.createElement("div");
      //   var randomNumber = Math.floor(Math.random() * 26 + 65);
      //   box.value = String.fromCharCode(randomNumber);
      box.value = generatedGrid[i][j];
      box.onclick = handleClick;
      box.row = i;
      box.col = j;
      box.explored = false;
      row.push(box);
      gridView.appendChild(box);
    }
    grid.push(row);
  }
}

document.addEventListener("keypress", function (e) {
  var pressedKey = e.key.toUpperCase();
  for (let i = 0; i < 5; ++i) {
    for (let j = 0; j < 5; ++j) {
      console.log(pressedKey);
      if (grid[i][j].value === pressedKey) {
        grid[i][j].innerText = pressedKey;
        grid[i][j].classList.add("explored");
      }
    }
  }
});

//********************Checking Solution****************************/
var index = [];
var selected = [];
var submittedWord = [];
var lastRow = -1;
var lastCol = -1;

function checkWord(e) {
  console.log(jsonData.words);
  var box = e.target;
  var word = submittedWord.join("").toLowerCase();
  if (jsonData.words.includes(word)) {
    notify("You Got The Point.");
  } else {
    console.log(selected);
    index = [];
    for (var i = 0; i < selected.length; ++i) {
      selected[i].classList.remove("selected");
    }
    submittedWord = [];
    selected = [];
    lastRow = -1;
    lastCol = -1;
  }
}

function handleClick(e) {
  var box = e.target;
  var br = box.row;
  var bc = box.col;
  console.log(box.value);
  if (index.length == 0) {
    lastRow = br;
    lastCol = bc;
    submittedWord.push(box.value);
    index.push([br, bc]);
    box.classList.add("selected");
    selected.push(box);
  } else {
    if (
      (lastRow + 1 == br && bc == lastCol) ||
      (lastRow - 1 == br && bc == lastCol) ||
      (lastRow == br && lastCol + 1 == bc) ||
      (lastRow == br && lastCol - 1 == bc && index.includes([br, bc]) == false)
    ) {
      box.classList.add("selected");
      selected.push(box);
      index.push([br, bc]);
      submittedWord.push(box.value);
      lastRow = br;
      lastCol = bc;
    } else {
      notify("Please select adjacent letters.");
    }
  }
}
//************************Notification***********************/
function notify(message) {
  notification.innerText = message;
  notification.classList.remove("hidden");
  setTimeout(function () {
    notification.classList.add("hidden");
  }, 2000);
}
