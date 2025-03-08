const mainPageElems
    = HeReact.createElements(`<h1>Welcome to HeReact!</h1>
                              <button onClick='{HeReact.changeRoute("example1")}'>Example 1</button>
                              <button onClick='{HeReact.changeRoute("example2")}'>Example 2</button>
                              <button onClick='{HeReact.changeRoute("example3?Change=me&React=...&int=123;")}'>Example 3</button>
                              <button onClick='{HeReact.changeRoute("example4")}'>Example 4</button>
                            `);

const mainPage = new Route('#', mainPageElems)
HeReact.addRoutes([mainPage]);
