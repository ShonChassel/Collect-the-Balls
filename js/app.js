'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'

const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = '💩'

const GAMER_IMG = '\n\t\t<img src="img/gamer.png">\n'
const BALL_IMG = '\n\t\t<img src="img/ball.png">\n'
const GLUE_IMG = '\n\t\t<img src="img/candy.png">\n'


var collectedSound = new Audio('sound/fon.mp3');

// Model:
var gIsGlued = false
var gInterval
var gIntervalGlue
var gBoard
var gGamerPos
var gCollected                                                  // מספר הכדורים שנאספו
var gCountBall                                               // מספר הכדורים שיש על הבורד 

function initGame() {
    gCountBall = 2
    gCollected = 0
    document.querySelector('h2').innerText = 'Collected: ' + gCollected;

    var elRestart = document.querySelector('.restart')
    elRestart.style.display = 'none'

    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gInterval = setInterval(addBall, 3000);
    gIntervalGlue = setInterval(addGlue, 5000);




}

function buildBoard() {
    var board = []

    // TODO: Create the Matrix 10 * 12 
    board = createMat(10, 12)

    // TODO: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === board.length - 1) board[i][j].type = WALL
            else if (j === 0 || j === board[i].length - 1) board[i][j].type = WALL

        }
    }
    board[0][5] = { type: FLOOR, gameElement: null }
    board[9][5] = { type: FLOOR, gameElement: null }
    board[5][0] = { type: FLOOR, gameElement: null }
    board[5][11] = { type: FLOOR, gameElement: null }

    // TODO: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[4][7].gameElement = BALL
    board[3][3].gameElement = BALL

    console.log(board);
    return board;
}

function addBall() {

    var randomI = getRandomInt(0, gBoard.length - 1)
    var randomJ = getRandomInt(0, gBoard.length - 1)
    var randomCell = gBoard[randomI][randomJ]

    if (randomCell.gameElement === null && randomCell.type === FLOOR) {
        randomCell.gameElement = BALL
        renderBoard(gBoard)
        gCountBall++
    } else {
        addBall()
    }

}

function addGlue() {
    var randomI = getRandomInt(0, gBoard.length - 1)
    var randomJ = getRandomInt(0, gBoard.length - 1)
    var randomCell = gBoard[randomI][randomJ]

    if (randomCell.gameElement === null && randomCell.type === FLOOR) {
        randomCell.gameElement = GLUE
        renderBoard(gBoard)
    } else {
        addGlue()
    }
}

// Render the board to an HTML table
function renderBoard(board) {

    var elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i}, ${j})">`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            } else if (currCell.gameElement === GLUE) {
                strHTML += GLUE_IMG;
            }



            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:')
    // console.log(strHTML)
    elBoard.innerHTML = strHTML

}

// Move the player to a specific location
function moveTo(i, j) {
    if (gIsGlued) return

    var targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i)
    var jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    // if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        if (targetCell.gameElement === BALL) {
            console.log('Collecting!')
            gCollected++
            gCountBall--
            document.querySelector('h2').innerText = 'Collected: ' + gCollected;
            collectedSound.play()
            isVictory()
        } else if (targetCell.gameElement === GLUE) {
            gIsGlued = true
            setTimeout(() => gIsGlued = false, 3000)
        }

        // TODO: Move the gamer
        // Update the Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // if(gGamerPos[0][gGamerPos.j])

        // DOM:
        renderCell(gGamerPos, '')

        // Update the Model:
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }

        // DOM:
        renderCell(gGamerPos, GAMER_IMG)

    // }
     
        console.log('TOO FAR', iAbsDiff, jAbsDiff)
   

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i
    var j = gGamerPos.j



    switch (event.key) {
        case 'ArrowLeft':
            if (i === 5 && j === 0) moveTo(5, 11);
            else moveTo(i, j - 1)
            break;
        case 'ArrowRight':
            if (i === 5 && j === 11) moveTo(5, 0);
            else moveTo(i, j + 1)
            break;
        case 'ArrowUp':
            console.log(i, j);
            if (i === 0 && j === 5) moveTo(9, 5);
            else moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            if (i === 9 && j === 5) moveTo(0, 5);
            else moveTo(i + 1, j)
            break;

    }

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}



function isVictory() {
    console.log(gCountBall);
    if (gCountBall == 0) {
        clearInterval(gInterval)
        clearInterval(gIntervalGlue)
        console.log(clearInterval);
        var elRestart = document.querySelector('.restart')
        elRestart.style.display = 'block'
    }
}
