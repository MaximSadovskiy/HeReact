function infoEvent(e) {
    console.log("Element pressed:", e.target, "\nEventInfo:", e)
}

function infoElement(e) {
    console.log("Element:", e)
}

const example6Elems
    = HeReact.createElements(`<h1>Pass info example! (Check console)</h1>
                              <div id="events" onclick='{infoEvent(event)}'>
                                <h2>You can pass event to a function</h2>
                                <br>
                                <button id='Button1'>Button1</button>
                                <button id='Button2'>Button2</button>
                                <button id='Button3'>Button3</button>
                              </div>
                              <h2>Or you can pass element itself</h2>
                              <br>
                              <button id='Epic_Button' onclick='{infoElement(this)}'>Epic butt</button>
                              ${backButton}
                            `);

HeReact.addRoute(new Route('#example6', example6Elems));
