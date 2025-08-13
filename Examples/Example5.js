const todos = []

function removeTODO(index, button)
{
    if (todos.length <= index)
        return false;
    const finalIndex = todos.findIndex(item => item.index === index);
    if (finalIndex === -1)
        return false;

    const todo = todos[finalIndex];
    if (!todo)
        return false;
    try {
        if (button) button.remove();
        todo.ptr.remove();
    } catch(e) {}
}

function addTODO(self)
{
    const parent = document.getElementById("todos");
    const inputText = document.getElementById("inputText");
    if (!parent || !inputText || !self)
        return;
    let str = inputText.value;
    if (str.length == 0)
        str = "empty :("

    const newIndex = todos.length;
    const newTodo = HeReact.createElement(`<h4 index=${newIndex}>${str}</h4>`);
    todos.push({index: newIndex, ptr: newTodo});
    parent.appendChild(newTodo);
    parent.appendChild(HeReact.createElement(`<button style="" onclick='{removeTODO(${newIndex}, this)}'>X<button/>`));
}

function keyDown(self, e)
{
    if (e.keyCode == 13)
    {
        addTODO(self);
    }
}

const example5Elems
    = HeReact.createElements(`<h1>Welcome to TODO!</h1>
                              <button onclick='{addTODO(this)}' style="font-size: 2em;">Create todo</button>
                              <input onkeydown="keyDown(this, event)" style="width:20em; height:3em;" id="inputText"/>
                              <div id="todos"> </div>
                              ${backButton}
                            `);

const example5Page = new Route('#example5', example5Elems);
HeReact.addRoutes([example5Page]);
