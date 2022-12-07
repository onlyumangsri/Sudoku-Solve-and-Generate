
var mat = [];
var solution="";
var timer;
var timeRemaining;
var lives;
var selectedTile;
var selectedNum;
var disableSelect;
let board="";

window.onload = function () {
    id("start-btn").addEventListener("click", startGame);
    id("theme-1").addEventListener("click", lightMode);
    id("theme-2").addEventListener("click", darkMode);
    

    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            if (!disableSelect) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else {
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}


function lightMode(){
    qs("body").classList.remove("dark");
}

function darkMode(){
    qs("body").classList.add("dark");
}

function startGame() {
    
    //choose difficulty
    if (id("diff-1").checked) {
        sudoku=generateSudoku(25);
        board=sudoku[0]
        solution=sudoku[1]
    }
    else if (id("diff-2").checked) {
        sudoku=generateSudoku(38);
        board=sudoku[0]
        solution=sudoku[1]
    }
    else if (id("diff-3").checked) {
        sudoku=generateSudoku(55);
        board=sudoku[0]
        solution=sudoku[1]
    }

    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: 3";

    generateBoard(board);

    startTimer();

    id("number-container").classList.remove("hidden");
    id("end-game").classList.remove("hidden");
    id("end-game").classList.add("forfit-btn");
    id("end-game").addEventListener("click", displayResult);
    

}

function startTimer() {
    if (id("time-1").checked) {
        timeRemaining = 180;
    }

    if (id("time-2").checked) {
        timeRemaining = 300;
    }
    if (id("time-3").checked) {
        timeRemaining = 600;
    }
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function () {
        timeRemaining--;
        if (timeRemaining == 0) {
            endGame();
        }

        id("timer").textContent = timeConversion(timeRemaining);

    }, 1000)
}

function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}


function displayResult(){
    let idCount = 0;
    clearPrevious()
    console.log(board)
    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");
        if (board.charAt(i) == "-") {
            tile.classList.add("red-word");
            tile.textContent = solution.charAt(i);
        }
        else{
            tile.textContent = solution.charAt(i);
        }
        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");

        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }

        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }

        id("board").appendChild(tile);
    }
}

function generateBoard(board) {
    clearPrevious();

    let idCount = 0;
    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");
        if (board.charAt(i) != "-") {
            tile.textContent = board.charAt(i);
        }
        else {

            tile.addEventListener("click", function () {
                if (!disableSelect) {
                    if (tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }
                    else {
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }

                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
                else {

                }
            });

        }
        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");

        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }

        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }

        id("board").appendChild(tile);
    }
}

function updateMove() {
    if (selectedTile && selectedNum) {
        selectedTile.textContent = selectedNum.textContent;
        if (checkCorrect(selectedTile)) {
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");

            selectedNum = null;
            selectedTile = null;
            if(checkDone())
            {
                endGame();
            }
        }
        else {
            disableSelect = true;
            selectedTile.classList.add("incorrect");
            setTimeout(function () {
                lives--;
                if (lives === 0) {
                    endGame();
                }
                else {
                    id("lives").textContent = "Lives Remaining: " + lives;
                    disableSelect = false;
                }
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                selectedTile.textContent = "";
                selectedTile=null;
                selectedNum=null;
            }, 1000);
        }
    }
}

function checkDone()
{
    let tiles=qsa(".tile");
    for(let i=0; i<tiles.length;i++)
    {
        if(tiles[i].textContent==="")
        {
            return false;
        }
    }
    return true;
}

function endGame()
{
    disableSelect=true;
    clearTimeout(timer);
    if(lives===0||timeRemaining===0)
    {
        id("lives").textContent="You Lost!";
        displayResult();
    }
    else{
        id("lives").textContent="You Won!";
    }
}

function checkCorrect(tile) {
    if (solution.charAt(tile.id) === tile.textContent) {
        board=board.substring(0,tile.id)+tile.textContent+board.substring(tile.id, board,length)
        return true;
    }
    else {
        return false;
    }
}

function clearPrevious() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    if (timer) {
        clearTimeout(timer);
    }
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    selectedTile = null;
    selectedNum = null;

}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

function id(id) {
    return document.getElementById(id);
}









function initialize(){
    for (var i = 0; i < 9; i++) {
        mat[i] = new Array(9);
        for (var j = 0; j < 9; j++) {
            mat[i][j] = 0
        }
    }
}

function generateSudoku(K) {

    initialize();

    fillDiagonal();

    fillRemaining(0, 3);
    solution=boardToString()
    removeKDigits(K);

    str=boardToString()

    
    
    return [str,solution];
}

function boardToString(){
    var str = "";
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++) {
            if (mat[i][j] == 0) {
                str += "-"
            }
            else {
                str += mat[i][j];
            }
        }
    return str
}


function fillDiagonal() {

    for (var i = 0; i < 9; i = i + 3)
        fillBox(i, i);
}

function unUsedInBox(rowStart, colStart, num) {
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            if (mat[rowStart + i][colStart + j] == num)
                return false;

    return true;
}

function fillBox(row, col) {
    var num;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            do {
                num = randomGenerator(9);
            }
            while (!unUsedInBox(row, col, num));

            mat[row + i][col + j] = num;
        }
    }
}

function randomGenerator(num) {
    return parseInt(Math.floor((Math.random() * num + 1)));
}

function CheckIfSafe(i, j, num) {
    return (unUsedInRow(i, num) &&
        unUsedInCol(j, num) &&
        unUsedInBox(i - i % 3, j - j % 3, num));
}

function unUsedInRow(i, num) {
    for (var j = 0; j < 9; j++)
        if (mat[i][j] == num)
            return false;
    return true;
}


function unUsedInCol(j, num) {
    for (var i = 0; i < 9; i++)
        if (mat[i][j] == num)
            return false;
    return true;
}

function fillRemaining(i, j) {

    if (j >= 9 && i < 9 - 1) {
        i = i + 1;
        j = 0;
    }
    if (i >= 9 && j >= 9)
        return true;

    if (i < 3) {
        if (j < 3)
            j = 3;
    }
    else if (i < 9 - 3) {
        if (j == parseInt(i / 3) * 3)
            j = j + 3;
    }
    else {
        if (j == 9 - 3) {
            i = i + 1;
            j = 0;
            if (i >= 9)
                return true;
        }
    }

    for (var num = 1; num <= 9; num++) {
        if (CheckIfSafe(i, j, num)) {
            mat[i][j] = num;
            if (fillRemaining(i, j + 1))
                return true;

            mat[i][j] = 0;
        }
    }
    return false;
}

function removeKDigits(K) {
    var count = K;
    while (count != 0) {
        var cellId = randomGenerator(9 * 9) - 1;
        //console.log(cellId);
        var i = parseInt(cellId / 9);
        //console.log(i);
        var j = cellId % 9;
        //console.log(j);
        if (j != 0)
            j = j - 1;

        if (mat[i][j] != 0) {
            count--;
            mat[i][j] = 0;
        }
    }
}