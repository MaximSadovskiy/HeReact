const countOfExamples = 10;

function renderPage() {
  let page = `<h1>Welcome to HeReact!</h1>`
  const specialPage3 = 3;
  const specialPage10 = 10;
  for (let i = 1; i <= countOfExamples; ++i)
  {
    if (i === specialPage3)
      page += `<button onClick='{HeReact.changeRoute("example${specialPage3}?Change=me&React=...&int=123;")}'>Example ${specialPage3}</button>`;
    else if (i === specialPage10)
      page += `<button onClick='{HeReact.changeRoute("example${specialPage10}?boardSize=3")}'>Example ${specialPage10}</button>`;
    else  
      page += `<button onClick='{HeReact.changeRoute("example${i}")}'>Example ${i}</button>`;
  }
  return page;
}

const mainPageElems = HeReact.createElements(renderPage());

const mainPage = new Route('#', mainPageElems)
HeReact.addRoute(mainPage);
