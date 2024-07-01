
# NeReact

A lightweight (a milles faster) replacement of React framewo... I mean library.

## Usage

Check out `Example.js`, if that is too boring, then here's summary:

```js

const app = new HeReact(); // One app for whole site

const mainPage = new Route('#', HeReact.createElements('<h1>Hello from HeReact</h1>')); // Register route

app.addRoutes([mainPage]);

app.render(); // First render (It will be automatic after that)

```

## Installation

Must be included as first script in html (HeReact.js)

#<script src="./HeReact.js"></script>

That's it
