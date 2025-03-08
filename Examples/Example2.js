let show = true;
function showElement(self) {
    const elem = document.getElementById('text');
    if (!elem) return;

    if (!show) {
        self.innerText = "Hide text";
        elem.style.visibility = "visible";
    } else {
        self.innerText = "Show text";
        elem.style.visibility = "hidden";
    }
    show = !show;
}

const showButton = `<button onclick='{showElement(this)}'>Hide text</button>`;
const example2Page = new Route('#example2', null);
// you can add elements later
example2Page.addElementsText(`<h1 id='text'>Welcome to HeReact!</h1>
                              ${showButton}
                              <br>
                              ${backButton}`);

HeReact.addRoute(example2Page);
