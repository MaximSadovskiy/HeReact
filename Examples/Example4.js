class Innercomponent {
    render(props) {
        console.log(props);
        return `<div id='unique'>
                  <h3>------------------------</h3>
                  <h3>This is inner component ${props.str}</h3>
                  <h3>------------------------</h3>
                </div>`;
    }
}
class Testcomponent {
    render(props) {
        return `<h1>Custom component example</h1>
                <h2>Component 1</h2>
                <Innercomponent class='second'>${HeReact.prop(props)}</Innercomponent>
                <h2>End of component 1</h2>
                ${backButton}`;
    }
}

const example4Page = new Route('#example4', HeReact.createElements(`<Testcomponent>${HeReact.prop("{str:'hello!'}")}</<Testcomponent>`));
HeReact.addRoute(example4Page);
