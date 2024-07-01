const app = new HeReact();

const mainMenuButton = `<a id="link" onclick='{exampleFunc("#")}'>Return to main page</a>`;
const [prop, setProp] = useState({});

class secondcomponent {
    render(props) {
        setProp(props);

        return `<div id='unique'>
                  <h3>This is second component</h3>
                  <h3>Hi 3</h3>
                  <h3>Hi 4</h3>
                  ${mainMenuButton}
                </div>`;
    }
}
class testcomponent {
    render(props) {
        
        return `<h1>Custom component example</h1>
                <h2 id='test'>Hi 1</h2>
                <h3 id='test'>Hi 2</h3>
                <SecondComponent class='second'>{int: 123, romanich: true, pole: true}</SecondComponent>`;
                // pass class 'second' to all elements in component
    }
}
class testtt {
	render(prop) {
		console.log(prop)
		return `<h1>Custom component</h1><h2>hi?</h2>`
	}
}

let show = true;
function showElement(self) {
    let elem = document.getElementById('newstyle');
    if (!show) {
        self.innerText = "hide text";
        elem.hidden = "";
    } else {
        self.innerText = "show text";
        elem.hidden = "true";
    }
    show = !show;
}
function exampleFunc(str) {
    app.changeRoute(str);
}
function beforeRenderFn(self) {
    console.log("Hello before render");
    const actions = app.getCurrentActionsStr();
    const arr = [];
    if (self.elems.componentsArr.length > 0) {
        arr.push(self.elems.componentsArr[0]);
        self.elems.componentsArr.length = 0;
    } else {
        arr.push(HeReact.createElement(`<h2>You can modify list by changing URL and pressing Enter!</h2>`));
    }
    if (actions.length > 0) {
        actions.split('&').forEach(act => {
            const action = act.split('=');
            const actionName = action[0];
            const actionText = action[1];
            arr.push(HeReact.createElement(`<div>${actionName} = ${actionText}</div>`));
        });
    }
    arr.push(HeReact.createElement(mainMenuButton));
    self.addElementsArr(arr);
}
function onMountFn(f) {
    console.log("Mounted successfully", f);
}
function updateCounter(isPositive) {
    const currentCounter = counter(); 
    if (isPositive) {
        setCounter(currentCounter + 1);
    } else {
        setCounter(currentCounter - 1);
    }
    if (counter() <= -1) {
        setCounter(0);
        alert("Counter cannot go bellow zero!");
    }
}
const mainPageElems
    = HeReact.createElements(`<h1>Welcome to main page!</h1>
                              <br>
                              <a href='https://google.com'>href example</a>
                              <br>
                              <br>
                              <a id='link' onclick='{exampleFunc("#second")}'>go to Show example</a>
                              <br>
                              <a id='link' onclick='{exampleFunc("#counter")}'>go to Counter example</a>
                              <br>
                              <a id='link' onclick='{exampleFunc("#test?Change=me&React=...&int=123;")}'>go to Autoupdate example</a>
                              <br>
                              <a id='link' onclick='{exampleFunc("#component")}'>go to Custom component example</a>`);
                     
const secondPageElems
    = HeReact.createElements(`<h2 id='test'>This is second page!</h2>
                              <div id='newstyle'>Better than React</div>
                              <button onclick='{alert("hello")}'>test alert</button>`);
                                     
//useState example
const [counter, setCounter] = useState(0);

// If you want to bind state to element you need to use $#{...(this)}
const thirdPageElems = HeReact.createElements(`<h1>You pressed: $#{counter(this)} times. </h1>
                                               <br>
                                               <button onclick='{updateCounter(true)}'>+1</button>
                                               <button onclick='{updateCounter(false)}'>-1</button>
                                               <br>
                                               ${mainMenuButton}`);
                                    
const mainPage   = new Route('#', mainPageElems)
const secondPage = new Route('#second', secondPageElems);
const thirdPage  = new Route('#counter', thirdPageElems, null, null, (self) => { console.log("Hello after render", self); });

const fourthPage = new Route('#test', HeReact.createElements(`<h1>You can add text by changing URL</h1>`), onMountFn, beforeRenderFn, () => { console.log("Hello after render"); });
const fifthPage = new Route('#component', HeReact.createElements(`<TestComponent> </TestComponent>`));
const sixthPage = new Route('#secret', HeReact.createElements(`<Testtt id='hi' class='class'>{test: 333, hi: 111}</Testtt>
                                                           <div id='xd' class='foo' onclick='alert(1)'>
                                                               <div id='hello'>
                                                                   <div id='inner'>hello inner</div>
                                                                       hello
                                                                   </div>
                                                                   <a>a text</a>
                                                               text
                                                           </div>
                                                           <h1>bye</h1>
                                                           <br>
                                                           <h1>custom</h1>
                                                           <Testtt></Testtt>`));
// you can add elements later
secondPage.addElementsText(`<button onclick='{showElement(this)}'>hide text</button>
                            <br>
                            <a onclick='{exampleFunc("#")}' id='link'>go to main page</a>`);

app.addRoutes([mainPage, secondPage, thirdPage, fourthPage, fifthPage, sixthPage]);

//   Or
// app.addRoute(mainPage);
// app.addRoute(secondPage);
// app.addRoute(thirdPage);
//...
app.render();