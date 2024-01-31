var origBoard;
var scores = { 'X': 0, 'O': 0 };
const huPlayer = 'O';
const aiPlayer = 'X';

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

const urlParameter = new URLSearchParams(window.location.search);
const difficulty = urlParameter.get('difficulty');

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
    if (playerTurn && typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer);
        playerTurn = false;
        let gameWon = checkWin(origBoard, huPlayer);
        if (!checkTie() && !gameWon) {
            setTimeout(function() {
                turn(bestSpot(), aiPlayer);
                playerTurn = true;
                checkWin(origBoard, aiPlayer); // Check if AI won after making a move
                checkTie(); // Check for a tie after AI makes a move
            }, 500); // Adjust the delay as needed
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
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
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

    playerScore.innerText = scores[huPlayer];
    aiScore.innerText = scores[aiPlayer];

    if (scores['O'] === 5 || scores['X'] === 5) {
        setTimeout(function() {
            declareWinner(scores['O'] === 5 ? "You win!" : "AI wins!");
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

function bestSpot() {
	switch (difficulty){
        case 'easy':
            return randomSquare();
        case 'medium':
            return mediumDifficulty();
        case 'hard':
            return hardDifficulty();

        default:
            randomSquare();
    }
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

//AI
//random(easy)
function randomSquare(){
    const availableSpots = emptySquares();
    const randomIndex = Math.floor(Math.random() * availableSpots.length)
    console.log(availableSpots[randomIndex]+ " is the randomly picked sqaure");
    return availableSpots[randomIndex];
}

//medium
function mediumDifficulty(){
    const availableSpots = emptySquares();

    //Check if can win on next move
    for (let i = 0; i < availableSpots.length; i++){
        const cloneBoard = origBoard.slice();
        cloneBoard[availableSpots[i]] = aiPlayer;
        if (checkWin(cloneBoard, aiPlayer)){
            console.log(availableSpots[i] + ' is my winning move');
            return availableSpots[i];
        }
    }

    //Check if player can win on next move then block if true
    for (let i = 0; i < availableSpots.length; i++){
        const cloneBoard = origBoard.slice();
        cloneBoard[availableSpots[i]] = huPlayer;
        if (checkWin(cloneBoard, huPlayer)){
            console.log(availableSpots[i] + ' is my blocking move');
            return availableSpots[i];
        }
    }

    //if no for the first 2 condition then random move
    return randomSquare();
}

//hard
function hardDifficulty(){
    const availableSpots = emptySquares();

    //Check if can win on next move
    for (let i = 0; i < availableSpots.length; i++){
        const cloneBoard = origBoard.slice();
        cloneBoard[availableSpots[i]] = aiPlayer;
        if (checkWin(cloneBoard, aiPlayer)){
            console.log(availableSpots[i] + ' is my winning move');
            return availableSpots[i];
        }
    }

    //Check if player can win on next move then block if true
    for (let i = 0; i < availableSpots.length; i++){
        const cloneBoard = origBoard.slice();
        cloneBoard[availableSpots[i]] = huPlayer;
        if (checkWin(cloneBoard, huPlayer)){
            console.log(availableSpots[i] + ' is my blocking move');
            return availableSpots[i];
        }
    }

    // Try to set up a future winning move
    // (place mark in a spot that creates a potential winning combination)
    for (let i = 0; i < availableSpots.length; i++){
        const cloneBoard = origBoard.slice();
        cloneBoard[availableSpots[i]] = aiPlayer;
        for (j = 0; j < availableSpots.length; j++){
            const cloneCloneBoard = cloneBoard.slice();
            cloneCloneBoard[availableSpots[j]] = aiPlayer;
            if (checkWin(cloneCloneBoard, aiPlayer)){
                    console.log(availableSpots[j] + ' is my winning strategic move');
                    return availableSpots[j];
            }
        }
    }

    // Try to block a future winning move
    // (place mark in a spot that creates a potential winning combination from the player)
    for (let i = 0; i < availableSpots.length; i++){
        const cloneBoard = origBoard.slice();
        cloneBoard[availableSpots[i]] = huPlayer;
        for (j = 0; j < availableSpots.length; j++){
            const cloneCloneBoard = cloneBoard.slice();
            cloneCloneBoard[availableSpots[j]] = huPlayer;
            if (checkWin(cloneCloneBoard, huPlayer)){
                    console.log(availableSpots[j] + ' is my blocking strategic move');
                    return availableSpots[j];
            }
        }
    }

    //if no for the first 3 condition then random move
    return randomSquare();
}
