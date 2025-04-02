class HtmlParser {
    static parser = new DOMParser();
    static body = document.getElementsByTagName("body")[0];
    static commonTags = ['a', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'p', 'span', 'img', 'input', 'textarea', 'select',
                        'button', 'label', 'table', 'tr', 'td', 'th', 'ul',
                        'ol', 'li', 'dl', 'dt', 'dd', 'form', 'fieldset',
                        'legend', 'script', 'style', 'link', 'meta',
                        'br', 'title', 'head', 'body', 'html'];
  
    static checkForCustomTag(tagName) {
      return !HtmlParser.commonTags.includes(tagName);
    }
  
    static parseElement(element) {
      const obj = {
        tagName: element.localName,
        attributes: [],
        childNodes: [],
        isCustom: HtmlParser.checkForCustomTag(element.localName),
        innerText: ""
      };
  
      // Attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        obj.attributes.push({ name: attr.nodeName, value: attr.nodeValue });
      }
  
      // Child nodes
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === 1) { // Element node
          obj.childNodes.push(HtmlParser.parseElement(child));
        } else if (child.nodeType === 3) { // Text node
          obj.innerText += child.nodeValue;
        }
      }
      return obj;
    }
  
    static createElementsInHtml(elements, parent) {
        const outHtmlelements = [];
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.isCustom) {
                try {
                    element.tagName = element.tagName[0].toLocaleUpperCase() + element.tagName.slice(1); // Custom props must be capitalized
                    let custom_obj = undefined;
                    let custom_prop = undefined;
                    eval(`custom_obj = new ${element.tagName}();`);
                    const prop_str = element.innerText;
                    if (prop_str.length > 0)
                        eval(`if (typeof ${prop_str} === 'object') custom_prop = Object.assign(${prop_str}); else custom_prop = ${prop_str};`);
                    const cutomObjAttribs = element.attributes;
                    const customObjElementsArr = HtmlParser.parseHtml(custom_obj.render(custom_prop));
                    customObjElementsArr.forEach(e => {
                        cutomObjAttribs.forEach(atr => e.setAttribute(atr.name, atr.value))
                        outHtmlelements.push(e);
                    });
                    continue;
                    // Add the custom element itself to the outHtmlelements array
                } catch (error) {
                    console.error("Failed to create custom object:", error);
                }
            } else {
                const newElement = document.createElement(element.tagName);
                for (let j = 0; j < element.attributes.length; j++) {
                    const attr = element.attributes[j];
                    newElement.setAttribute(attr.name, attr.value);
                }
                newElement.innerText = element.innerText;
                for (let j = 0; j < element.childNodes.length; j++) {
                    const child = element.childNodes[j];
                    const childArr = HtmlParser.createElementsInHtml([child], newElement);
                    childArr.forEach(e => outHtmlelements.push(e));
                }
                if (parent !== undefined) {
                    parent.appendChild(newElement);
                }
                outHtmlelements.push(newElement);
            }
        };
        return outHtmlelements;
    }
  
    static parseHtml(html) {
      const htmlText = html.replaceAll("\t", "").replaceAll("\n", "").replace(/\s+/g, ' ');
      const doc = HtmlParser.parser.parseFromString(htmlText, "text/html");
      const elements = doc.body.childNodes;
      const resultObjs = [];
  
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].nodeName === '#text') {
            continue;
        };
        resultObjs.push(HtmlParser.parseElement(elements[i]));
      }
      return HtmlParser.createElementsInHtml(resultObjs);
    }
    static showElements(arr, root) {
      for (let i = 0; i < arr.length; ++i) {
          if (arr[i].childNodes > 1) {
              continue
          };
          root.appendChild(arr[i]);
      }
    }
  }
class Component {
    componentsArr = [];
    constructor(elem) {
        if (isArray(elem)) {
            this.componentsArr = elem;
        } else if (typeof elem === "object") {
            try {
                this.componentsArr.push(HeReact.createElement(elem.render()));
            } catch (e) {
                throw new Error(
                    "Custom component needs to have render function"
                );
            }
        } else if (typeof elem === "string") {
            this.componentsArr.push(HeReact.createElement(elem));
        } else {
            throw new Error("Unknown component type");
        }
    }
    getElementById(idStr) {
        let index = -1;
        this.componentsArr.forEach((e, idx) => {
            if (e.id == idStr) {
                index = idx;
            }
        });
        if (index === -1) return null;
        else return this.componentsArr[index];
    }
    getElementByClass(classStr) {
        let index = -1;
        this.componentsArr.forEach((e, idx) => {
            if (e.class == classStr) {
                index = idx;
            }
        });
        if (index === -1) return null;
        else return this.componentsArr[index];
    }
}
class Route {
    pathName = "";
    elems = [];
    onMountFunc;
    beforeRenderFunc;
    afterRenderFunc;
    constructor(
        pathName,
        elems,
        onMountFunc,
        beforeRenderFunc,
        afterRenderFunc
    ) {
        if (!HeReact.validateValue(elems))
            elems = [];
        if (pathName.length > 0)
        {
            if (pathName[0] !== "#")
                throw new Error("Route must start with \"#\"")
        }
        else
            pathName = "#";

        this.pathName = pathName;
        this.elems = new Component(elems);
        this.onMountFunc = onMountFunc;
        this.beforeRenderFunc = beforeRenderFunc;
        this.afterRenderFunc = afterRenderFunc;
        if (!isFunction(this.onMountFunc)) this.onMountFunc = () => {};
        if (!isFunction(this.beforeRenderFunc))
            this.beforeRenderFunc = () => {};
        if (!isFunction(this.afterRenderFunc)) this.afterRenderFunc = () => {};
        this.callOnMountFunc();
    }
    callOnMountFunc() {
        try {
            this.onMountFunc(this);
        } catch (e) {
            console.error("Error in onMountFunction: ", e);
        }
    }
    callBeforeRenderFunc() {
        try {
            this.beforeRenderFunc(this);
        } catch (e) {
            console.error("Error in beforeRenderFunction: ", e);
        }
    }
    callAfterRenderFunc() {
        try {
            this.afterRenderFunc(this);
        } catch (e) {
            console.error("Error in afterRenderFunction: ", e);
        }
    }
    getElementById(idStr) {
        return this.elems.getElementById(idStr);
    }
    getElementByClass(classStr) {
        return this.elems.getElementByClass(classStr);
    }
    addElementsText(innerHTML) {
        let tempArr = HeReact.createElements(innerHTML);
        tempArr.forEach((e) => {
            this.elems.componentsArr.push(e);
        });
    }
    addElementsArr(arr) {
        arr.forEach((e) => {
            this.elems.componentsArr.push(e);
        });
    }
}
class State {
    target = null;
    property = "";
    lineStart = 0;
    lineEnd = 0;
    constructor(target, property, start, end) {
        this.target = target;
        this.property = property;
        this.lineStart = start;
        this.lineEnd = end;
    }
}
class HeReact {
    routes = [];
    root;
    hash;
    constructor() {
        let rootElem = document.getElementById("root");
        if (rootElem == null) {
            rootElem = document.createElement("div");
            rootElem.setAttribute("class", "root");
            rootElem.setAttribute("id", "root");
            document.body.append(rootElem);
        }
        this.root = rootElem;
        this.hash = window.location.hash;
        window.addEventListener("hashchange", () => {
            this.hash = window.location.hash;
            this.hash.replace("/", "#");
            HeReact.render();
        });
    }
    static addRoutes(routesArr) {
        if (!isArray(routesArr))
            throw new Error("Cannot pass non-array as a multiple routes, use \"addRoute()\" instead");
        routesArr.forEach((e) => {
            HeReact.addRoute(e);
        });
        HeReact.render();
    }
    static addRoute(route) {
        if (isArray(route))
            throw new Error("Cannot pass array as a single route, use \"addRoutes()\" instead");
        _app.routes.push(route);
        HeReact.render();
    }
    static clear() {
        _app.root.innerHTML = "";
    }
    static render(routeStr) {
        if (routeStr === undefined)
            routeStr = HeReact.getCurrentRouteStr();
        HeReact.clear();
        let index = -1;
        for (let i = 0; i < _app.routes.length; ++i) {
            const test = _app.routes[i];
            if (_app.routes[i].pathName === routeStr) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return;
        } else {
            const elem = _app.routes[index];

            try {
                elem.callBeforeRenderFunc(_app.routes[index]);
            } catch (e) {
                console.error("Error in beforeRenderFunction: ", e);
            }
            HtmlParser.showElements(elem.elems.componentsArr, _app.root);
            try {
                elem.callAfterRenderFunc(_app.routes[index]);
            } catch (e) {
                console.error("Error in afterRenderFunction: ", e);
            }
        }
    }
    static changeRoute(routeStr) {
        window.location.hash = routeStr;
        HeReact.render(routeStr);
    }
    static getCurrentRouteStr() {
        let routeStr = _app.hash;
        if (routeStr.length === 0) routeStr = "#";
        const route = routeStr.split("?");
        routeStr = route[0];
        return routeStr;
    }
    static getCurrentActionsStr() {
        let routeStr = _app.hash;
        if (routeStr.length === 0) routeStr = "#";
        const route = routeStr.split("?");
        if (route.length > 1) {
            return route[1];
        }
        return [];
    }
    static prop(str)
    {
        if (typeof str === 'string') return str;
        else return JSON.stringify(str);
    }
    // bool -> (val : any)
    static validateValue(val) {
        return val !== undefined && val !== null; // JS is retartet;
    }
    static createElement(innerHTML) {
        const arr = HeReact.createElements(innerHTML);
        if (arr.length > 0) return arr[0];
        return [];
    }
    static parseStateOfElements(elementsArr) {
        for (let j = 0; j < elementsArr.length; ++j) {
            let text = elementsArr[j].innerText;
            const ress = elementsArr[j];
            let regexp = /[$][#]{.*?}/g;
            const abc = Array.from(text.matchAll(regexp));
            let accumLength = 0;
            for (let testt of abc) {
                testt.forEach((e, idx) => {
                    const start = testt.index + 3;
                    const end = testt.index + testt[idx].length - 1;
                    let command = testt.input.slice(start, end);
                    const state = new State(
                        ress,
                        "innerText",
                        start - 3 + accumLength
                    );
                    const constructorStr =
                        state.constructor.name.toLocaleLowerCase();
                    command = command.replace("this", `${constructorStr}`);
                    const commandAddition = command.indexOf(constructorStr);
                    let commandStr = "";
                    if (
                        commandAddition !== -1 &&
                        commandAddition + constructorStr.length + 1 <
                            command.length
                    ) {
                        commandStr = command.slice(
                            commandAddition + constructorStr.length + 1,
                            command.length
                        );
                        command = command.replace(
                            `${constructorStr}`,
                            `${constructorStr}, "` + commandStr + '"'
                        );
                    }
                    let result;
                    eval(`result = ${command};`);
                    text =
                        text.slice(0, start - 3 + accumLength) +
                        "" +
                        result +
                        "" +
                        text.slice(
                            testt.index + accumLength + ("" + e).length,
                            text.length
                        );
                    accumLength += ("" + result).length - e.length;
                });
            }
            elementsArr[j].innerText = text;
        }
    }
    static createElements(innerHTML) {
        const resArr = HtmlParser.parseHtml(innerHTML);
        for (let j = 0; j < resArr.length; ++j) {
            const ress = resArr[j];
            if (ress.localName === "br" || ress.localName === "img" || ress.localName === "input" || !ress.childNodes[0]) continue;
            let text = ress.childNodes[0].nodeValue;
            let regexp = /[$][#]{.*?}/g;
            const abc = Array.from(text.matchAll(regexp));
            let accumLength = 0;
            for (let testt of abc) {
                testt.forEach((e, idx) => {
                    const start = testt.index + 3;
                    const end = testt.index + testt[idx].length - 1;
                    let command = testt.input.slice(start, end);
                    const state = new State(
                        ress,
                        "innerText",
                        start - 3 + accumLength
                    );
                    const constructorStr =
                        state.constructor.name.toLocaleLowerCase();
                    command = command.replace("this", `${constructorStr}`);
                    const commandAddition = command.indexOf(constructorStr);
                    let commandStr = "";
                    if (
                        commandAddition !== -1 &&
                        commandAddition + constructorStr.length + 1 <
                            command.length
                    ) {
                        commandStr = command.slice(
                            commandAddition + constructorStr.length + 1,
                            command.length
                        );
                        command = command.replace(
                            `${constructorStr}`,
                            `${constructorStr}, "` + commandStr + '"'
                        );
                    }
                    let result;
                    eval(`result = ${command};`);
                    text =
                        text.slice(0, start - 3 + accumLength) +
                        "" +
                        result +
                        "" +
                        text.slice(
                            testt.index + accumLength + ("" + e).length,
                            text.length
                        );
                    accumLength += ("" + result).length - e.length;
                });
            }
            ress.childNodes[0].nodeValue = text;
        }
        return resArr;
    }
}
function useState(val, eventName) {
    let newVal = val;
    let command = "";
    let customEv = null;
    if (eventName !== undefined && eventName !== null)
    {
        if (typeof eventName === 'function')
            eventName = eventName.name;

        customEv = new CustomEvent(eventName);
        let fn = () => {eval(`if (eventName !== undefined) ${eventName}()`);};
        document.addEventListener(eventName, fn); 
    }
    const stateArr = [];
    function state(element, cmnd) {
        if (element !== undefined) {
            element.lineEnd = element.lineStart + ("" + newVal).length;
            stateArr.push(element);
        }
        if (cmnd !== undefined && cmnd.length > 0) {
            command = cmnd;
        }
        return newVal;
    }
    function setVal(newValue, cmnd) {
        if (customEv !== null)
            document.dispatchEvent(customEv);
        if (cmnd !== undefined && cmnd !== null && cmnd.length > 0) {
            command = cmnd;
        }
        if (command.length > 0) {
            eval(`newVal = newValue${command}`);
        } else {
            newVal = newValue;
        }
        stateArr.forEach((e, idx) => {
            if (e === null || e.target === null) {
                throw new Error(
                    "useState setter called with a state element that is null"
                );
            }
            const start = e.target.innerText.slice(0, e.lineStart);
            const end = e.target.innerText.slice(
                e.lineEnd,
                e.target.innerText.length
            );

            e.target.innerText = start + "" + newVal + "" + end;
            let before = e.lineEnd;
            e.lineEnd = e.lineStart + ("" + newVal).length;
            let beforee = before - e.lineEnd;

            if (before !== 0) {
                const sameElement = stateArr.filter(
                    (el, index) =>
                        el.target === e.target &&
                        index !== idx &&
                        el.lineStart >= e.lineEnd
                );
                sameElement.forEach((f) => {
                    if (f === null || f.target === null) {
                        throw new Error(
                            "useState setter called with a state element that is null"
                        );
                    }

                    //fix
                    f.lineStart -= beforee;
                    f.lineEnd -= beforee;
                });
            }
        });
    }
    return [state, setVal];
}
function isArray(arr) {
    return toString.call(arr) === "[object Array]";
}
function isFunction(func) {
    return typeof func === "function";
}

const _app = new HeReact();