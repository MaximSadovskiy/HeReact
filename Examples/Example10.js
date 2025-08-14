class Game {
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
            if (map[i] === undefined)
                return false;
        }
        return true;
    }

    static makeTurn(button) {
        const state = this.state();
        if (state.isOver)
            return;
        const key = button.attributes.key.value;
        if (state.map[key] !== undefined)
            return;
        state.map[key] = state.turn;
        
        if (state.turn === true)
            button.innerText = "O";
        else
            button.innerText = "X";
        button.style.color = "";
        state.turn = !state.turn;
        Game.updateState(state);
        
        const winner = this.checkForWin(state.map, Game.sizeOfBoard);
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
        Game.updateState({ map: [], turn: true, isOver: false });
        const buttons = document.getElementsByClassName("square");
        for (let but of buttons)
            but.style.color = "transparent";
        Info.setHidden(true);
    }
    
    drawRow(key, sizeOfBoard) {
        let rowText = `<div class='board-row'> \n`;
        for (let i = 0; i < sizeOfBoard; ++i)
            rowText += `<button class="square" key="${key++}" style="color: transparent" onclick="Game.makeTurn(this)">O</button>\n`;
        rowText += `</div>`;

        return rowText;
    }

    drawBoard() {
        const sizeOfBoard = Game.sizeOfBoard;
        let board = "<div class='board-game'> \n";
        for (let i = 0; i < sizeOfBoard; ++i) {
            board += this.drawRow(i * sizeOfBoard, sizeOfBoard);
        }
        board += "</div>";
        return board;
    }

    render() {
        [Game.state, Game.updateState] = useState({});
        [Game.winnerText, Game.setWinnerText] = useState("");
        Game.resetGame();

        const actions = HeReact.getCurrentActionsStr();
        if (actions.length > 0) {
            actions.split('&').forEach(act => {
                const action = act.split('=');
                const actionName = action[0];
                const actionText = action[1];
                if (actionName === "boardSize")
                    Game.sizeOfBoard = actionText;
                if (!Game.sizeOfBoard || Game.sizeOfBoard < 3)
                    Game.sizeOfBoard = 3;
            });
        }
        
        return `${this.drawBoard()}`;
    }
}
class Info {
    static setHidden(bool) {
        if (!Info.setHiddenState) return;

        if (bool)
            Info.setHiddenState("hidden")
        else
            Info.setHiddenState("")
    }
    
    render() {
        [Info.hiddenState, Info.setHiddenState] = useState("hidden")
        return `<button id="reset_button" style="visibility: $#{Info.hiddenState(this)}" onclick='Game.resetGame()'>
                    Reset game
                </button>
                <h2 style="visibility: $#{Info.hiddenState(this)}">
                    $#{Game.winnerText(this)}
                </h2>`;
    }
}

HeReact.addRoute(
    new Route(
        "#example10", HeReact.createElements(`<h1>Tic Tac Toe example!</h1>
                                              <Game>${prop(3)}</Game>
                                              <Info></Info>
                                              ${backButton}`)
    )
);
