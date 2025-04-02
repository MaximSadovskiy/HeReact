let count = 1;

const mainPageElems
    = HeReact.createElements(`<h1>Welcome to HeReact!</h1>
                              <button onClick='{HeReact.changeRoute("example${count}")}'>Example ${count++}</button>
                              <button onClick='{HeReact.changeRoute("example${count}")}'>Example ${count++}</button>
                              <button onClick='{HeReact.changeRoute("example${count}?Change=me&React=...&int=123;")}'>Example ${count++}</button>
                              <button onClick='{HeReact.changeRoute("example${count}")}'>Example ${count++}</button>
                              <button onClick='{HeReact.changeRoute("example${count}")}'>Example ${count++}</button>
                            `);

const mainPage = new Route('#', mainPageElems)
HeReact.addRoutes([mainPage]);
