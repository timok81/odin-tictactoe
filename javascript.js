//Gameboard logic
const gameBoard = (function () {
    let board = [];
    const columns = 3;
    const rows = 3;

    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            board.push({ column: j, row: i, mark: '' });
        }
    };
    const getBoard = () => board;
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const getWinningCombos = () => winningCombos;

    const setBoardMark = (player, position) => {
        if (board[position].mark === '') {
            board[position].mark = player;
            return true;
        }
        else { return false; }
    };

    const resetBoard = () => {
        for (i = 0; i < board.length; i++) { board[i].mark = ''; };
    };

    return { getBoard, setBoardMark, resetBoard, getWinningCombos };
})();

//Player factory
function createPlayer(name) {
    this.name = name;
    let token = 'X';
    const setToken = (symbol) => token = symbol;
    const getToken = () => token;

    return { name, setToken, getToken };
};

//Game logic
const game = (function () {
    let players = [];
    let currentPlayer;

    const setPlayers = (playerA = 'Player 1', playerB = 'Player 2') => {
        players[0] = createPlayer(playerA);
        players[1] = createPlayer(playerB);
        players[0].setToken('X');
        players[1].setToken('O');
        currentPlayer = players[0];
        console.log(`${currentPlayer.name} goes first.`);
    };

    const getCurrentPlayer = () => currentPlayer;
    const resetCurrentPlayer = () => currentPlayer = players[0];

    const placeMark = (currentPlayer, position) => {
        if (gameBoard.setBoardMark(currentPlayer.name, position)) {
            checkForRoundWin(currentPlayer);
        }
    };

    //Check if player won after their move
    const checkForRoundWin = (player) => {
        const currentBoard = gameBoard.getBoard();
        const winningCombos = gameBoard.getWinningCombos();
        let isWon = 0;

        for (i = 0; i < winningCombos.length; i++) {
            if (winningCombos[i].filter((element) => currentBoard[element].mark === player.name).length === 3) {
                isWon = 1;
                endRound();
            }
        };

        if (isWon === 0) {
            if (currentPlayer === players[0]) currentPlayer = players[1];
            else currentPlayer = players[0];

            if (gameBoard.getBoard().filter((square) => square.mark === '').length === 0) {
                updateScreen.displayMessage(`Game has ended in a tie`);
                updateScreen.removeEventListeners();
            }
            else {
                updateScreen.displayMessage(`${currentPlayer.name}'s turn`);
            }
        }
    };

    //Win round logic
    const endRound = () => {
        console.log('end round was triggerd');
        updateScreen.displayMessage(`${currentPlayer.name} has won!`);
        updateScreen.removeEventListeners();
    }

    return { setPlayers, placeMark, getCurrentPlayer, resetCurrentPlayer };
})();

//Updates visuals on the page and handles interaction
const updateScreen = (function () {
    const infoDiv = document.querySelector('.gameresult');
    const visualBoard = document.querySelector('.gameboard');
    const board = gameBoard.getBoard();
    const newGameButton = document.querySelector('.newgamebutton');
    const form = document.querySelector('form');

    newGameButton.addEventListener('click', () => {
        const player1Name = form.elements.player1name.value;
        const player2Name = form.elements.player2name.value;
        gameBoard.resetBoard();
        game.setPlayers(player1Name, player2Name);
        clearVisualBoard();
        renderNewBoard();
        addEventListeners();
        displayMessage(`${game.getCurrentPlayer().name}'s turn`);
    })

    const renderNewBoard = () => {
        for (square of board) {
            const visualSquare = document.createElement('div');
            visualSquare.classList.add('square');
            visualSquare.setAttribute('id', board.indexOf(square));
            visualBoard.appendChild(visualSquare);
        }
    }

    const addEventListeners = () => {
        let allSquares = document.querySelectorAll('.square');
        allSquares.forEach(visualSquare => {
            visualSquare.addEventListener('click', renderMark)
        });
    }

    const removeEventListeners = () => {
        let allSquares = document.querySelectorAll('.square');
        allSquares.forEach(visualSquare => {
            visualSquare.removeEventListener('click', renderMark)
        });
    };

    const renderMark = (e) => {
        const id = e.target.getAttribute('id');
        if (gameBoard.getBoard()[id].mark === '') {
            e.target.innerText = game.getCurrentPlayer().getToken();
            game.placeMark(game.getCurrentPlayer(), id);
        }
    }

    const clearVisualBoard = () => {
        let allSquares = document.querySelectorAll('.square');
        for (square of allSquares) { square.remove(); }
    }

    const displayMessage = (message) => {
        infoDiv.innerText = message;
    }

    return { renderNewBoard, clearVisualBoard, removeEventListeners, addEventListeners, displayMessage };
})();

//Initialize page
game.setPlayers();
updateScreen.renderNewBoard();
updateScreen.addEventListeners();
updateScreen.displayMessage(`${game.getCurrentPlayer().name}'s turn`);