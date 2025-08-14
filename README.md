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

// Target element
const container = document.getElementById("container");

// Create a new Observatory instance
const watcher = new Observatory({
    element: container,
    onMutation: (mutations, observer) => {
        console.log("DOM changed inside container", mutations);
    },
    onStart: () => {
        console.log("Observation started!");
    },
});

// Begin observing
watcher.observe();

// Dynamically update options (triggers re-observe)
watcher.options = {
    attributes: true,
};

// Stop observing
watcher.disconnect();

// Get any pending mutation records
const records = watcher.takeRecords();
console.log(records);
```

## API

`new Observatory(config)`

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>`element`</th>
            <td>`HTMLElement`</td>
            <td>The DOM element you want to observe (required).</td>
        </tr>
        <tr>
            <th>`onMutation`</th>
            <td>`(mutations, observer, instance) => void`</td>
            <td>Callback function when mutations occur (required).</td>
        </tr>
        <tr>
            <th>`onStart`</th>
            <td>`() => void`</td>
            <td>Optional callback function when observation begins.</td>
        </tr>
        <tr>
            <th>`options`</th>
            <td>`object`</td>
            <td>Optional MutationObserver options.</td>
        </tr>
        <tr>
            <th>`useDefaultOptions`</th>
            <td>`boolean`</td>
            <td>Merge options with default options (`childList: true, subtree: true`). Default `true`.</td>
        </tr>
        <tr>
            <th>`startImmediately`</th>
            <td>`boolean`</td>
            <td>Start observing immediately. Default `false`.</td>
        </tr>
    </tbody>
</table>

## Properties & Methods

- `observer.options`
- `observer.useDefaultOptions`
- `observe()`
- `disconnect()`
- `takeRecords()`

## Examples

### Watch for added nodes

```javascript
const watcher = new Observatory({
	element: container,
	onMutation: (mutations) => {
		mutations.forEach(mutation => {
			if (mutation.type === "childList") {
				console.log("New nodes added:", mutation.addedNodes);
			}
		});
	},
});
watcher.observe();
```

### Watch for attribute changes only

```javascript
const watcher = new Observatory({
	element: container,
	onMutation: () => console.log("Attribute changed"),
	options: { attributes: true },
	useDefaultOptions: false,
});
watcher.observe();
```
