//useState example
const [counter, setCounter] = useState(0);

function updateCounter() {
    setCounter(counter() + 1);
}

const example1Elems
    = HeReact.createElements(`<h1>Welcome to HeReact!</h1>
                              <div>
                                <a class='box'>
                                  <img src='./logo.svg' class='logo' alt='Shit browser, gg'>
                                </a>
                                <button onclick='{updateCounter()}'>You pressed $#{counter(this)}</button>
                              </div>
                              ${backButton}
                            `);

const example1Page = new Route('#example1', example1Elems);
HeReact.addRoutes([example1Page]);
