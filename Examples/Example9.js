async function fetch_stuff() {
    const example_JSON =
    `[
        {
            "title": "OpenAI Homepage",
            "url": "https://www.openai.com/"
        },
        {
            "title": "MDN Web Docs",
            "url": "https://developer.mozilla.org/"
        },
        {
            "title": "Stack Overflow",
            "url": "https://stackoverflow.com/"
        }
    ]`;

    return new Promise(resolve => {
        setTimeout(() => {
          resolve(example_JSON);
        }, 723);
    });
}

class Image_example {
    // Async render can only be used in Custom props
    async render() {
        const response_objs = JSON.parse(await fetch_stuff());
        
        let str = "";
        for (let i = 0; i < response_objs.length; ++i)
        {
            str += `<h2>Title: ${response_objs[i].title}</h2>`;
            str += `<h3>URL: ${response_objs[i].url}</h1>`;
            str += `<div style='margin: 35px'></div>`
        }
        return str;
    }
}
                                                                
HeReact.addRoute(new Route('#example9', HeReact.createElements(`<h1>Async render example!</h1>
                                                                <Image_example></Image_example>
                                                                ${backButton}`)));
