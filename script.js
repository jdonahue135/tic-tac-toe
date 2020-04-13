let xoContainers = document.querySelectorAll('.xo-container')

// Module for game board
const gameBoard = (() => {
    
    let board = [];

    //render contents of gameboard array to website
    const renderBoard = (square, player) => {
        console.log('rendering board...');
        target = document.querySelector('#'+square);
        target.textContent = player.getIcon();
    }
    const clearBoard = () => {
        console.log('clearing board...');            
        for (box in xoContainers) {
            xoContainers[box].textContent = '';
        }
    }
    return { renderBoard, clearBoard }
})();

//factory function for players
const Player = (name, icon) => {
    let wins = 0;
    const getName = () => name;
    const getWins = () => wins;
    const winGame = () => wins++;
    const getIcon = () => icon;
    return {getName, getWins, winGame, getIcon }
}

//factory funciton for gameplay
const Game = (name1, name2) => {
    gameBoard.clearBoard();
    const player1 = Player(name1, 'X');
    const player2 = Player(name2, 'O');
    let activePlayer = player1
    let selectedSquare;

    const playTurn = () => {
        for (x = 0; x < xoContainers.length; x++) {
            xoContainers[x].addEventListener('click', function chosenSquare(e) {
                selectedSquare = e.target.id
                e.target.removeEventListener('click', chosenSquare);
                gameBoard.renderBoard(selectedSquare, activePlayer);

                if (activePlayer == player1) { 
                    activePlayer = player2
                } else { activePlayer = player1 }
            });
        }
    }

    const playGame = () => {
        //check for winner
        //TODO
        playTurn(activePlayer);
    }
    return { playGame }
}

Game('Jake', 'Kels').playGame();