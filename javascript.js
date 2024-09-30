//Create gameboard
const gameBoard = (function () {
    let board = [];
    const columns = 3;
    const rows = 3;
    //Create board, set properties
    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            board.push({ column: j, row: i, mark: '' });
        }
    };
    const getBoard = () => board;

    //Place mark if space unoccupied
    const setBoardMark = (player, position) => {
        if (board[position].mark === '') {
            board[position].mark = player;
            return 1;
        }
        else { return 0; }
    };

    //Reset board
    const resetBoard = () => {
        for (i = 0; i < board.length; i++) { board[i].mark = ''; };
    };

    return { getBoard, setBoardMark, resetBoard };
})();

//Player factory
function createPlayer(name) {
    this.name = name;
    let score = 0;
    let token = 'X';
    const setToken = (symbol) => token = symbol;
    const getToken = () => token;
    const getScore = () => score;
    const increaseScore = () => score++;

    return { name, setToken, getToken, getScore, increaseScore };
};

//Game logic
const game = (function () {
    let players = [];
    let currentPlayer;

    const setPlayers = (playerA = "Player 1", playerB = "Player 2") => {
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
        if (gameBoard.setBoardMark(currentPlayer.name, position) === 1) {
            checkForRoundWin(currentPlayer);
        }
    };

    //Check if player won after their move
    const checkForRoundWin = (player) => {
        const currentBoard = gameBoard.getBoard();

        if (
            (currentBoard[0].mark === player.name &&
                currentBoard[1].mark === player.name &&
                currentBoard[2].mark === player.name) ||
            (currentBoard[3].mark === player.name &&
                currentBoard[4].mark === player.name &&
                currentBoard[5].mark === player.name) ||
            (currentBoard[6].mark === player.name &&
                currentBoard[7].mark === player.name &&
                currentBoard[8].mark === player.name) ||
            (currentBoard[0].mark === player.name &&
                currentBoard[3].mark === player.name &&
                currentBoard[6].mark === player.name) ||
            (currentBoard[1].mark === player.name &&
                currentBoard[4].mark === player.name &&
                currentBoard[7].mark === player.name) ||
            (currentBoard[2].mark === player.name &&
                currentBoard[5].mark === player.name &&
                currentBoard[8].mark === player.name) ||
            (currentBoard[0].mark === player.name &&
                currentBoard[4].mark === player.name &&
                currentBoard[8].mark === player.name) ||
            (currentBoard[2].mark === player.name &&
                currentBoard[4].mark === player.name &&
                currentBoard[6].mark === player.name)
        ) {
            endRound(player);
        }
        else {
            if (currentPlayer === players[0]) currentPlayer = players[1];
            else if (currentPlayer === players[1]) currentPlayer = players[0];

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
    const endRound = (player) => {
        player.increaseScore();
        console.log(`${player.name} has won the round!`);
        updateScreen.displayMessage(`${currentPlayer.name} has won!`);
        updateScreen.removeEventListeners();
    }

    return { setPlayers, placeMark, getCurrentPlayer, resetCurrentPlayer };
})();

//Updates visuals on the page and handles interaction
const updateScreen = (function () {
    const infoDiv = document.querySelector(".gameresult");
    const visualBoard = document.querySelector(".gameboard");
    const board = gameBoard.getBoard();
    const newGameButton = document.querySelector(".newgamebutton");
    const form = document.querySelector("form");

    newGameButton.addEventListener("click", () => {
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
            const visualSquare = document.createElement("div");
            visualSquare.classList.add("square");
            visualSquare.setAttribute('id', board.indexOf(square));
            visualBoard.appendChild(visualSquare);
        }
    }

    const addEventListeners = () => {
        let allSquares = document.querySelectorAll(".square");
        allSquares.forEach(visualSquare => {
            visualSquare.addEventListener("click", renderMark)
        });
    }

    const renderMark = (e) => {
        if (e.target.innerText === '') {
            e.target.innerText = game.getCurrentPlayer().getToken();
            game.placeMark(game.getCurrentPlayer(), e.target.getAttribute('id'));
        }
    }

    const clearVisualBoard = () => {
        let allSquares = document.querySelectorAll(".square");
        for (square of allSquares) { square.remove(); }
    }

    const displayMessage = (message) => {
        infoDiv.innerText = message;
    }

    const removeEventListeners = () => {
        let allSquares = document.querySelectorAll(".square");
        allSquares.forEach(visualSquare => {
            visualSquare.removeEventListener("click", renderMark)
        });
    };

    return { renderNewBoard, clearVisualBoard, removeEventListeners, addEventListeners, displayMessage };
})();

//Initialize page
game.setPlayers();
updateScreen.renderNewBoard();
updateScreen.addEventListeners();
updateScreen.displayGameStatus(game.getCurrentPlayer());