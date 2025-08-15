class Game {
    static defaultSize = 3;
    static checkForWin(map, n) {
        const winningLines = [];
    
        for (let row = 0; row < n; row++) {
            const line = [];
            for (let col = 0; col < n; col++) {
                line.push(row * n + col);
            }
            winningLines.push(line);
        }
    
        for (let col = 0; col < n; col++) {
            const line = [];
            for (let row = 0; row < n; row++) {
                line.push(row * n + col);
            }
            winningLines.push(line);
        }
    
        const mainDiagonal = [];
        for (let i = 0; i < n; i++) {
            mainDiagonal.push(i * n + i);
        }
        winningLines.push(mainDiagonal);
    
        const antiDiagonal = [];
        for (let i = 0; i < n; i++) {
            antiDiagonal.push(i * n + (n - 1 - i));
        }
        winningLines.push(antiDiagonal);
    
        for (const line of winningLines) {
            const first = map[line[0]];
            if (first === undefined || first === null) continue;
    
            let hasWon = true;
            for (let i = 1; i < line.length; i++) {
                if (map[line[i]] !== first) {
                    hasWon = false;
                    break;
                }
            }
            if (hasWon) return first;
        }
    
        return null;
    }

    static checkForDraw(map) {
        for (let i = 0; i < map.length; ++i) {
            if (map[i] === null)
                return false;
        }
        return true;
    }

    static makeTurn(button) {
        const state = this.state();
        if (state.isOver)
            return;
        const key = button.attributes.key.value;
        if (state.map[key] !== null)
            return;
        state.map[key] = state.turn;
        
        if (state.turn === true)
            button.innerText = "O";
        else
            button.innerText = "X";
        button.style.color = "";
        state.turn = !state.turn;
        Game.updateState(state);
        
        const winner = this.checkForWin(state.map, Game.size());
        const isDraw = this.checkForDraw(state.map);
        if (winner !== null || isDraw) {
            state.isOver = true;
            if (isDraw && winner === null)
                Game.setWinnerText("Draw :(");
            else if (winner === true)
                Game.setWinnerText("Player [O] have won!");
            else
                Game.setWinnerText("Player [X] have won!");
                
            Info.setHidden(false);
        }
    }

    static resetGame() {
        const size = Game.size();
        const map = new Array(size * size).fill(null);
        Game.updateState({ map: map, turn: true, isOver: false });
        const buttons = document.getElementsByClassName("square");
        for (let but of buttons)
            but.style.color = "transparent";
        Info.setHidden(true);
    }
    
    static drawRow(key, sizeOfBoard) {
        let rowText = `<div class='board-row'>`;
        for (let i = 0; i < sizeOfBoard; ++i)
            rowText += `<button class="square" key="${key++}" style="color: transparent" onclick="Game.makeTurn(this)">O</button>\n`;
        rowText += `</div>`;

        return rowText;
    }

    static drawBoard() {
        Game.resetGame();
        const board = HeReact.getElementById("board-game");
        if (!board) return;
        board.innerHTML = ""; // remove all childs
        const sizeOfBoard = Game.size();
        let rows = "";
        for (let i = 0; i < sizeOfBoard; ++i) {
            rows += Game.drawRow(i * sizeOfBoard, sizeOfBoard);
        }
        rows = HeReact.createElements(rows);
        for (let i = 0; i < rows.length; ++i)
            board.appendChild(rows[i]);
    }

    static handleRedraw(e, input) {
        if (e.key == 'Enter') {
            if (Info.isNumber(input.value))
            {
                if (input.value < 1)
                {
                    alert("You are not smart.")
                    input.value = 1;
                }
                if (input.value > 50)
                {
                    alert("Woah, woah. Too much. I can only give you 50.")
                    input.value = 50;
                }
                Game.setSize(input.value)
            }
            else
                alert("Provide correct number.")
        }
    }

    render() {
        [Game.state, Game.updateState] = useState({});
        [Game.winnerText, Game.setWinnerText] = useState("");
        [Game.size, Game.setSize] = useState(3, "Game.drawBoard");
        Game.resetGame();
        
        return `<div id='board-game' style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"> </div>`;
    }
}
class Info {
    static isNumber(str) {
        return !isNaN(str) && !isNaN(parseFloat(str));
    }
    static setHidden(bool) {
        if (!Info.setHiddenState) return;

        if (bool)
            Info.setHiddenState("hidden")
        else
            Info.setHiddenState("")
    }
    
    render() {
        [Info.hiddenState, Info.setHiddenState] = useState("hidden")
        return `<h2 style="visibility: $#{Info.hiddenState(this)}; margin: 0.7em;">
                    $#{Game.winnerText(this)}
                </h2>
                <button id="reset_button" style="visibility: $#{Info.hiddenState(this)}" onclick='Game.resetGame()'>
                    Reset game
                </button>`;
    }
}

HeReact.addRoute(
    new Route(
        "#example10", HeReact.createElements(`<h1>Tic Tac Toe example!</h1>
                                              <h2>(You can change size of board)</h2>
                                              <input 
                                                 value="${Game.defaultSize}"
                                                 onkeydown="Game.handleRedraw(event, this)"
                                                 style="margin-bottom: 2em;"/>
                                              <Game></Game>
                                              <Info></Info>
                                              ${backButton}`),
        null, null, Game.drawBoard
    )
);
