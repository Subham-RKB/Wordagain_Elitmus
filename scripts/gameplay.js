const overlay = document.getElementById("overlay");
const notification = document.getElementById("notification");
const gridView = document.getElementById("grid");

var grid = [];
var generatedGrid = [];
var visited = [];
var rows = 5;
var cols = 5;
var jsonData = [];
var index = [];
var selected = [];
var submittedWord = [];
var lastRow = -1;
var lastCol = -1;
var alphabet = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];

generateGrid();
setInterval(function(){
  generateGrid();
  window.localStorage.setItem('generatedGrid', JSON.stringify(generatedGrid));
}, 24*60*60*1000);

// *************************** Fetching The Dictionary ****************************//

fetch("./scripts/word.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    jsonData = data;
    initLocalStorage();
    keyBoard();
  });
document.getElementById("submit").onclick = checkWord;
overlay.onclick = function () {
  overlay.classList.add("hidden");
};

function initLocalStorage() {
  var oldGrid = JSON.parse(window.localStorage.getItem('generatedGrid'));
  //console.log(oldGrid[1]);
  if (!oldGrid) {
    frontEndGridGenerator(generatedGrid);
    window.localStorage.setItem('generatedGrid', JSON.stringify(generatedGrid));
  } else {
    frontEndGridGenerator(oldGrid);
  } 
}

//************************Point Calculation********************//
var keyStroke = 0;

//**********************Filling Up Grid*******************************

function gridGeneratorHelper(i, j, word, k) {
  if (k == word.length) {
    return true;
  }
  if (i < 0 || i >= 5 || j < 0 || j >= 5) return false;
  if (visited[i][j] == 1) {
    return false;
  }

  generatedGrid[i][j] = word[k];
  visited[i][j] = 1;
  var ans =
    gridGeneratorHelper(i + 1, j, word, k + 1) ||
    gridGeneratorHelper(i - 1, j, word, k + 1) ||
    gridGeneratorHelper(i, j + 1, word, k + 1) ||
    gridGeneratorHelper(i, j - 1, word, k + 1);

  if (ans == false) {
    visited[i][j] = 0;
  }
  return ans;
}

function putWordInGrid(word) {
  var index_i = Math.floor(Math.random() * 5);
  var index_j = Math.floor(Math.random() * 5);
  if (generatedGrid[index_i][index_j] == "*") {
    return gridGeneratorHelper(index_i, index_j, word, 0);
  }
  return false;
}

function generateGrid() {
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
  //console.log(jsonData.words);
  while (i <= 2) {
    var random_index = Math.floor(Math.random() * 2285);
    var word = jsonData.words[random_index];
    if (putWordInGrid(word.toUpperCase()) == true) {
      i = i + 1;
      console.log(word);
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

function frontEndGridGenerator(generatedGrid) {
  //console.log(jsonData.words);
  
  for (let i = 0; i < 5; ++i) {
    var row = [];
    for (let j = 0; j < 5; ++j) {
      var box = document.createElement("div");
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
function keyBoardOnclick(e) {
  var key = e.target;
  key.classList.add("explored");
  keyStroke++;
  for (let i = 0; i < 5; ++i) {
    for (let j = 0; j < 5; ++j) {
      //console.log(key.innerText);
      if (grid[i][j].value === key.value) {
        grid[i][j].innerText = key.value;
        grid[i][j].classList.add("explored");
      }
    }
  }
}
var keyMap = new Map();
var keyboardView = document.getElementById("keyboard");
function keyBoard() {
  var keyCount = [10, 9, 7];
  var pos = 0;
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < keyCount[i]; ++j) {
      var key = document.createElement("div");
      key.classList.add("key");
      key.innerText = alphabet[pos];
      key.value = alphabet[pos];
      key.onclick = keyBoardOnclick;
      ++pos;
      keyboardView.children[i].appendChild(key);
      keyMap.set(key.value, key);
    }
  }
}

document.addEventListener("keypress", function (e) {
  var pressedKey = e.key.toUpperCase();
  keyStroke++;
  keyMap.get(pressedKey).classList.add("explored");
  for (let i = 0; i < 5; ++i) {
    for (let j = 0; j < 5; ++j) {
      //console.log(pressedKey);
      if (grid[i][j].value === pressedKey) {
        grid[i][j].innerText = pressedKey;
        grid[i][j].classList.add("explored");
      }
    }
  }
});

//********************Checking Solution****************************/

function checkWord(e) {
  //console.log(jsonData.words);
  //var box = e.target;
  var word = submittedWord.join("").toLowerCase();
  if (jsonData.words.includes(word)) {
    var point = word.length - keyStroke;
    if (point < 0) {
      point = 3;
    }
    notify(
      "You found the word " +
        word.toUpperCase() +
        " and scored " +
        point +
        " points."
    );
  } else {
    //console.log(selected);
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
  //console.log(box.value);
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
