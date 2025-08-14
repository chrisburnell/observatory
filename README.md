# Observatory

A JavaScript Class to simplify managing Mutation Observers.

**[Demo](https://chrisburnell.github.io/observatory/demo.html)** | **[Further reading](https://chrisburnell.com/observatory/)**

*More detail in this README to come soon!*

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@chrisburnell/observatory): `npm install @chrisburnell/observatory`
1. [Download the source manually from GitHub](https://github.com/chrisburnell/observatory/releases) into your project.
1. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)

## Usage

```javascript
import Observatory from "./observatory.js";

const container = document.getElementById("container");

const watcher = new Observatory({
    element: container,
    onMutation: (mutations, observer) => {
        console.log("DOM changed inside container", mutations);
    },
    onStart: () => {
        console.log("Observation started!");
    },
});

watcher.observe();

watcher.options = {
    attributes: true,
};

watcher.disconnect();

console.log(watcher.takeRecords());
```

