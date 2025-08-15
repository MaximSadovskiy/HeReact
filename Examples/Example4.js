class Innercomponent {
    render(props) {
        console.log("Passed property:", props);
        return `<div id='unique'>
                  <h3>------------------------</h3>
                  <h3>This is inner component "${props.str}"</h3>
                  <h3>------------------------</h3>
                </div>`;
    }
}
// !!! Only first symbol uppercase for custom components, for now.
class Testcomponent {
    render(props) {
        return `<h1>Custom component (and passing props) example</h1>
                <h2>Component 1</h2>
                <Innercomponent class='second'>${prop(props)}</Innercomponent>
                <h2>End of component 1</h2>
                ${backButton}`;
    }
}

const example4Page = new Route('#example4', HeReact.createElements(`<Testcomponent>
                                                                        ${prop("{str:'hello!'}")}
                                                                    </<Testcomponent>`));
HeReact.addRoute(example4Page);
