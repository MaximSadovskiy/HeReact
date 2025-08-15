const countOfExamples = 10;

function renderPage() {
  let page = `<h1>Welcome to HeReact!</h1>`
  const specialPage = 3;
  for (let i = 1; i <= countOfExamples; ++i)
  {
    if (i === specialPage)
      page += `<button onClick='{HeReact.changeRoute("example${specialPage}?Change=me&React=...&int=123;")}'>Example ${specialPage}</button>`;
    else  
      page += `<button onClick='{HeReact.changeRoute("example${i}")}'>Example ${i}</button>`;
  }
  return page;
}

const mainPageElems = HeReact.createElements(renderPage());

const mainPage = new Route('#', mainPageElems)
HeReact.addRoute(mainPage);
