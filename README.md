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
            <th><code>element</code></th>
            <td><code>HTMLElement</code></td>
            <td>The DOM element you want to observe (<em>required</em>).</td>
        </tr>
        <tr>
            <th><code>onMutation</code></th>
            <td><code>(mutations, observer, instance) => void</code></td>
            <td>Callback function when mutations occur (<em>required</em>).</td>
        </tr>
        <tr>
            <th><code>onStart</code></th>
            <td><code>(instance) => void</code></td>
            <td>Optional callback function when observation begins.</td>
        </tr>
        <tr>
            <th><code>options</code></th>
            <td><code>object</code></td>
            <td>Optional MutationObserver options.</td>
        </tr>
        <tr>
            <th><code>useDefaultOptions</code></th>
            <td><code>boolean</code></td>
            <td>Merge options with default options (<code>childList: true, subtree: true</code>). Default <code>true</code>.</td>
        </tr>
        <tr>
            <th><code>startImmediately</code></th>
            <td><code>boolean</code></td>
            <td>Start observing immediately. Default <code>false</code>.</td>
        </tr>
    </tbody>
</table>

## Properties & Methods

- `observer.defaultOptions` (*getter*)
- `observer.options` (*getter*/*setter*)
- `observer.useDefaultOptions` (*getter*/*setter*)
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

### Extend/Augment into own Class

```javascript
import Observatory from "@chrisburnell/observatory";

export default class MyOwnObservatory {
	constructor() {
		super({
			element: container,
			options: {
				characterData: true,
				attributes: true,
			}
		});
	}
	this.mySpecialVariable;
	this.onMutation = (mutations, observer, instance) => {
		this.mySpecialVariable = instance.element.innerText;
	};
}
```

## Notes

- If `options` or `useDefaultOptions` are updated while observing, *Observatory* will restart the observer automatically, so there is no need to recall `observe()`.
- `onStart` is guaranteed to only run **once**, no matter how many times `observe()` is called.
