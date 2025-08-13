const INPUT_ID = "input";
const RESULT_TEXT_ID = "result";

function calculate()
{
    const [isFound, text] = HeReact.getElementTextById(INPUT_ID);
    if (isFound && text.length > 0) {
        Calculator.setResultText(eval(text));
    }
}

class Calculator {
    render() {
        // Or you can use "self."
        //   but it will bind itself to global state, so watchout if function names may colide.
        //   ...But you can use state functions without prefix "Calculator."
        [Calculator.resultText, Calculator.setResultText] = useState("0");

        return `<h1>${this.constructor.name} example!</h1>
                <div>
                    <h2 id="${RESULT_TEXT_ID}">Result: $#{Calculator.resultText(this)}</h2>
                </div>
                <input id="${INPUT_ID}" style="width:20em; height:3em;"/>
                <button style="width:6.5em; height:1.5em;" onclick='{calculate()}'>Calculate</button>
                ${backButton}`;
    }
}

HeReact.addRoute(new Route('#example8', HeReact.createElements(`<Calculator></Calculator>`)));
