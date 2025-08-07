function updateTotalCount()
{
    setTotalCount(totalCount() + 1)
}
function updateButtonCounter(button)
{
    if (button.id === "but1")
        setButtonCount1(buttonCount1() + 1)
    else
        setButtonCount2(buttonCount2() + 1)
}

const [buttonCount1, setButtonCount1] = useState(0, updateTotalCount);
const [buttonCount2, setButtonCount2] = useState(0, updateTotalCount);
const [totalCount, setTotalCount] = useState(0);

const example7Elems
    = HeReact.createElements(`<h1>UseEvent example!</h1>
                              <div>
                                <h2>Total count: $#{totalCount(this)}</h2>
                                <button id="but1" onclick='{updateButtonCounter(this)}'>First: $#{buttonCount1(this)}</button>
                                <button id="but2" onclick='{updateButtonCounter(this)}'>Second: $#{buttonCount2(this)}</button>
                              </div>
                              ${backButton}
                            `);

HeReact.addRoute(new Route('#example7', example7Elems));
