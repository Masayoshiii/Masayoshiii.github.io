var origBoard;
var scores = { 'X': 0, 'O': 0 };

const playerScore = document.getElementById("player_score");
const aiScore = document.getElementById("ai_score");

const winCombos = [
    // horizontal win
    [0, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29],

    // vertical win
    [0, 6, 12, 18, 24],
    [1, 7, 13, 19, 25],
    [2, 8, 14, 20, 26],
    [3, 9, 15, 21, 27],
    [4, 10, 16, 22, 28],
    [5, 11, 17, 23, 29],

    // diagonal win (left - right)
    [18, 25],
    [12, 19, 26],
    [6, 13, 20, 27],
    [0, 7, 14, 21, 28],
    [1, 8, 15, 22, 29],
    [2, 9, 16, 23],
    [3, 10, 17],
    [4, 11],
    
    // diagonal win (right - left)
    [28, 23],
    [27, 22, 17],
    [26, 21, 16, 11],
    [25, 20, 15, 10, 5],
    [24, 19, 14, 9 , 4],
    [18, 13, 8, 3],
    [12, 7, 2],
    [6, 1]
]

let playerTurn = true;

const cells = document.querySelectorAll('.cell');
clearTables();

function clearTables() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(30).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    playerTurn = true;
}

function resetScores() {
    scores['O'] = 0;
    scores['X'] = 0;
    document.querySelector(".endgame .text").innerText = "0 - 0";

    playerScore.innerText = "0";
    aiScore.innerText = "0";
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        let currentPlayer = playerTurn ? 'X' : 'O';
        turn(square.target.id, currentPlayer);
        playerTurn = !playerTurn;

        let gameWon = checkWin(origBoard, currentPlayer);
        if (!checkTie() && !gameWon) {
            // Continue game
        }
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    var currentCell = document.getElementById(squareId);
    currentCell.innerText = player;

    // Set the text color to white
    currentCell.style.color = 'white';

    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon);
        updateScores(gameWon.player);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == 'X' ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == 'X' ? "Player X wins!" : "Player O wins.");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
    setTimeout(function() {
        document.querySelector(".endgame").style.display = "none";
        clearTables();
    }, 2000); // Adjust the timeout duration as needed (1.5 seconds in this case)
    
}

function updateScores(player) {
    scores[player]++;
    document.querySelector(".endgame .text").innerText = scores['O'] + " - " + scores['X'];

    playerScore.innerText = scores['O'];
    aiScore.innerText = scores['X'];

    if (scores['O'] === 5 || scores['X'] === 5) {
        setTimeout(function() {
            declareWinner(scores['O'] === 5 ? "Player O wins!" : "Player X wins!");
            setTimeout(function(){
                resetScores();
            }, 2000);
        }, 2000); // Adjust the timeout duration as needed
    } else if (checkTie()) {
        setTimeout(function() {
            declareWinner("Tie Game!");
            setTimeout(function(){
                resetScores();
            }, 2000);
        }, 2000); // Adjust the timeout duration as needed
    }
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game")
        return true;
    }
    return false;
}
