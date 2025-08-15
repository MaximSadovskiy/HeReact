function beforeRenderFn(self) {
    console.log("-------------------");
    console.log("Hello before render");
    const actions = HeReact.getCurrentActionsStr();
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
            const newDiv = `<h2>${actionName} = ${actionText}</h2>`;
            console.log(`  ${newDiv}`);
            arr.push(HeReact.createElement(newDiv));
        });
    }
    arr.push(HeReact.createElement(backButton));
    self.addElementsArr(arr);
    console.log("-------------------");
}

const example3Page = new Route('#example3',
                                HeReact.createElements(`<h1>You can add text by changing URL:</h1>`),
                                null,
                                beforeRenderFn, () => { console.log("Hello after render"); });
HeReact.addRoute(example3Page);
