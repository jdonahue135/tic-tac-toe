const xoContainers = document.querySelectorAll('.xo-container')
const startButton = document.querySelector('#start');

startButton.addEventListener('click', (e) => {
    if (document.querySelector('#player1').value == '' || document.querySelector('#player2').value == '') {
        return
    }
    console.log(document.querySelector('#player1').value);
    e.target.setAttribute('value', 'Restart')
    let form = document.querySelectorAll('.form')
    for (let i = 0; i < form.length; i++) {
        form[i].setAttribute('hidden', 'true');
    }
    gameController(document.querySelector('#player1').value, document.querySelector('#player2').value);
})

// Module for game board DOM manipulation
const gameBoard = (() => {
    
    //render contents of gameboard array to website
    const renderBoard = (square) => {
        target = document.querySelector('#' + square.box);
        target.textContent = square.icon;
    }
    const clearBoard = () => {
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
const gameController = (name1, name2) => {
    gameBoard.clearBoard();
    const player1 = Player(name1, 'X');
    const player2 = Player(name2, 'O');
    let activePlayer = player1
    let selectedSquare;
    let winningPlayer;

    let playedBoxes = []

    const playGame = () => {
        for (let x = 0; x < xoContainers.length; x++) {
            xoContainers[x].addEventListener('click', function chosenSquare(e) {
                selectedSquare = e.target.id
                e.target.removeEventListener('click', chosenSquare);
                square = {'box': selectedSquare, 'icon': activePlayer.getIcon()}
                gameBoard.renderBoard(square);
                playedBoxes.push(square);
                if (playedBoxes.length > 4)
                    {
                        checkForWinner(playedBoxes);
                    }
                if (activePlayer == player1) { 
                    activePlayer = player2
                } else { activePlayer = player1 }
            });
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
            //this prints 'winner' twice because it checks each combo 2 times (when the same box is y and z).
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
                console.log('winner!')
                const winMessage = document.querySelector('h2')
                winningPlayer = activePlayer;
                winMessage.textContent = `${winningPlayer.getName()} wins! Congratulations!`
                winMessage.removeAttribute('hidden')
                //end the game and disable everything
            }
        }
    }
    const endGame = () => {
        //TODO
    }
    playGame(activePlayer);
}
