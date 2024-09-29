//Create gameboard
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
    const setBoardMark = (player, position) => {
        if (board[position].mark === '') {
            board[position].mark = player;
            return 1;
        }
        else { return 0; }
    };

    const resetBoard = () => {
        for (i = 0; i < board.length; i++) { board[i].mark = ''; };
    };

    return { getBoard, setBoardMark, resetBoard };
})();

//Player factory
function createPlayer(name) {
    this.name = name;
    score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;

    return { name, getScore, increaseScore };
};

//Game logic
const game = (function () {
    let currentPlayer = {};
    let players = [];

    const setPlayers = (playerA = "Player 1", playerB = "Player 2") => {
        players[0] = createPlayer(playerA);
        players[1] = createPlayer(playerB);
        currentPlayer = players[0];
        console.log(`${currentPlayer.name} goes first.`);
    };

    const getCurrentPlayer = () => currentPlayer;

    const placeMark = (currentPlayer, position) => {
        if (gameBoard.setBoardMark(currentPlayer.name, position) === 1) {
            checkForRoundWin(currentPlayer);
        }
        else {
            console.log('Space is occupied!');
        }
    };

    //Check if player won after their move
    const checkForRoundWin = (player) => {
        console.log('Checking for win');
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
            console.log('Win condition found');
            endRound(player);
        }
        else {
            if (currentPlayer === players[0]) currentPlayer = players[1];
            else if (currentPlayer === players[1]) currentPlayer = players[0];
            console.log(`No winner yet. Switching player turns, ${currentPlayer.name} goes next.`);
        }
    };

    //Someone won the round
    const endRound = (player) => {
        player.increaseScore();
        console.log(`${player.name} has won the round!`);
        gameBoard.resetBoard();
        if (player.getScore() >= 3) {
            console.log('Someone has won');
            endGame(player);
        }
    }

    //After 3 wins, game ends
    const endGame = (player) => {
        console.log(`${player.name} has won the game!`)
        gameBoard.resetBoard();
    }

    return { setPlayers, placeMark, getCurrentPlayer };
})();