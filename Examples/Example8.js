const INPUT_ID = "input";
const RESULT_TEXT_ID = "result";

function sanitizeMathInput(input) {
  // Allow only digits, operators + - * /, decimal point, parentheses and whitespace
  const allowedRegex = /^[0-9+\-*/().\s]+$/;
  
  if (allowedRegex.test(input)) {
    return input;
  } else {
    alert("You are not cool.\nOnly allowed digits, operators (+ - * /), decimal point and parentheses");
    return "";
  }
}

function calculate(e)
{
    if (e && e.key !== "Enter")
        return;
    const [isFound, text] = HeReact.getElementTextById(INPUT_ID);
    if (isFound && text.length > 0) {
        // Totally safe eval.
        Calculator.setResultText(eval(sanitizeMathInput(text)));
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
                <input id="${INPUT_ID}" style="width:20em; height:3em; margin:1em;" onkeydown='{calculate(event)}'/>
                ${backButton}`;
    }
}

HeReact.addRoute(new Route('#example8', HeReact.createElements(`<Calculator></Calculator>`)));
