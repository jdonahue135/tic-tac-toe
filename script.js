// Module for game board DOM manipulation
const gameBoard = (() => {
    const startButton = document.querySelector('#start');
    startButton.addEventListener('click', (e) => {
        if (startButton.value == 'Start') {
            if (document.querySelector('#player1').value == '' || document.querySelector('#player2').value == '') {
                return
            }
            e.target.setAttribute('value', 'Restart')
            let form = document.querySelectorAll('.form')
            for (let i = 0; i < form.length; i++) {
                form[i].setAttribute('hidden', 'true');
            }
        }
        gameController.playGame(document.querySelector('#player1').value, document.querySelector('#player2').value);
    })

    const makeBoard = () => {
        const gameBoardContainer = document.querySelector('#game-board-container');
        if (gameBoardContainer.hasChildNodes() == true) {
            //clear old items
            var div = gameBoardContainer.lastElementChild;
            while (div) {
                gameBoardContainer.removeChild(div);
                div = gameBoardContainer.lastElementChild;
            }
        }
        for (let x = 0; x < 9; x++) {
            const div = document.createElement('div');
            div.setAttribute('class', 'xo-container');
            div.setAttribute('id', 'box' + x);
            gameBoardContainer.appendChild(div);
        }
        console.log('board made')
    }
    //render contents of gameboard array to website
    const renderBoard = (square) => {
        if (gameController.getStatus() == true) {
            target = document.querySelector('#' + square.box);
            target.textContent = square.icon;
        }
    }
    return { makeBoard, renderBoard }
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

//module for gameplay
const gameController = (() => {
    let activePlayer;
    let winningPlayer;
    let gameStatus;
    let playedBoxes;
    const getStatus = () => gameStatus;

    const playGame = (name1, name2) => {
        gameStatus = true;
        playedBoxes = []
        const player1 = Player(name1, 'X');
        const player2 = Player(name2, 'O');
        activePlayer = player1;
        gameBoard.makeBoard();
        let xoContainers = document.querySelectorAll('.xo-container');
        //make sure event listeners are added to all squares
        for (let x = 0; x < xoContainers.length; x++) {
            
            // make sure icon renders to correct box
            xoContainers[x].addEventListener('click', function chosenSquare(e) {

                square = {'box': e.target.id, 'icon': activePlayer.getIcon()}

                //disable event listener
                e.target.removeEventListener('click', chosenSquare);

                console.log(square)
                
                //render icon to correct square
                gameBoard.renderBoard(square);
                
                trackSquares(square);

                //change active player
                if (activePlayer == player1) { 
                    activePlayer = player2
                } else { activePlayer = player1 }
            });
        }
    }
    const trackSquares = (square) => {
        if (gameStatus == true) {
            playedBoxes.push(square);
            if (playedBoxes.length > 4) { checkForWinner(playedBoxes); }
        }
    }
    const checkForWinner = (playedBoxes) => {
        //split to 'x' and 'o' boxes
        xBoxes = [];
        oBoxes = [];

        for (let x = 0; x < playedBoxes.length; x++) {
            if (playedBoxes[x]['icon'] == 'X') {
                xBoxes.push(playedBoxes[x]['box'])
            } else {oBoxes.push(playedBoxes[x]['box'])}
        }

        evaluateBoxes(xBoxes.sort());
        evaluateBoxes(oBoxes.sort());
    }
    const evaluateBoxes = (boxes) => {
        if (boxes.length == 3) {
            compareArray(boxes);
        } else if (boxes.length == 4) {
            for (let x = 0; x < 4; x++) {
                let splicedBox = boxes[x];
                boxes.splice(x, 1);
                compareArray(boxes);
                boxes.push(splicedBox);
                boxes.sort();
            }
        } else if (boxes.length == 5) {
            for (let y = 0; y < 5; y++) {
                let splicedBox1 = boxes[y]
                boxes.splice(y, 1);
                for (let z = 0; z < 4; z++) {
                    let splicedBox2 = boxes[z];
                    boxes.splice(z, 1);
                    compareArray(boxes);
                    boxes.push(splicedBox2);
                    boxes.sort();
                }
                boxes.push(splicedBox1);
                boxes.sort();
            }
            if (!winningPlayer) {
                endGame();
            }
        }
    }
    const compareArray = (a) => {
        a.sort();
        const winCombos = [
            ["box0", "box1", "box2"],
            ["box3", "box4", "box5"],
            ["box6", "box7", "box8"],
            ["box0", "box3", "box6"],
            ["box1", "box4", "box7"],
            ["box2", "box5", "box8"],
            ["box0", "box4", "box8"],
            ["box2", "box4", "box6"]
        ]
        for (let x = 0; x < winCombos.length; x++) {
            //JSON stringify converts arrays to strings for comparison
            if (JSON.stringify(winCombos[x]) == JSON.stringify(a)) {
                winningPlayer = activePlayer;
                endGame();
            }
        }
    }
    const endGame = () => {
        const winMessage = document.querySelector('h2')
        if (winningPlayer == '' || winningPlayer == null) {
            winMessage.textContent = `It's a tie.`;
        } else { winMessage.textContent = `${winningPlayer.getName()} wins! Congratulations!`}
        winMessage.removeAttribute('hidden');
        gameStatus = false;
        winningPlayer = ''
    }
    return { getStatus, playGame }
})();
gameBoard.makeBoard();