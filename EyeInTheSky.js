/**
 * @typedef {object} EyeInTheSkyConfig
 * @property {HTMLElement} element
 * @property {(mutations: MutationRecord[], observer: MutationObserver, instance: EyeInTheSky) => void} onMutation
 * @property {() => void} [onStart]
 * @property {object} [options]
 * @property {boolean} [useDefaultOptions]
 * @property {boolean} [startImmediately]
 */
export default class EyeInTheSky {
	/**
	 * @class
	 * @param {EyeInTheSkyConfig} config
	 */
	constructor({
		element,
		onMutation,
		onStart = () => {},
		useDefaultOptions = true,
		options = {},
		startImmediately = false,
	}) {
		if (!(element instanceof HTMLElement)) {
			throw new TypeError(
				"EyeInTheSky: `element` must be an HTMLElement",
			);
		}

		/** @type {HTMLElement} **/
		this.element = element;
		/** @type {(mutations: MutationRecord[], observer: MutationObserver, instance: EyeInTheSky) => void} **/
		this.onMutation = onMutation;
		/** @type {() => void} **/
		this.onStart = onStart;
		/** @type {boolean} **/
		this.startImmediately = startImmediately;

		/** @type {object} **/
		this._options = options;
		/** @type {boolean} **/
		this._useDefaultOptions = useDefaultOptions;

		/** @type {boolean} **/
		this.hasStarted = false;
		/** @type {boolean} **/
		this.isObserving = false;

		if (startImmediately) {
			this.observe();
		}
	}

	/**
	 * @type {object}
	 */
	static defaultOptions = {
		childList: true,
		subtree: true,
	};

	/**
	 * @type {object}
	 */
	get options() {
		if (!this._useDefaultOptions) {
			return this._options;
		}
		return {
			...EyeInTheSky.defaultOptions,
			...this._options,
		};
	}

	/**
	 * @returns {void}
	 */
	set options(value) {
		this._options = value;
		if (this.isObserving) {
			this.observe();
		}
	}

	/**
	 * @type {boolean}
	 */
	get useDefaultOptions() {
		return this._useDefaultOptions;
	}

	/**
	 * @returns {void}
	 */
	set useDefaultOptions(value) {
		this._useDefaultOptions = Boolean(value);
		if (this.isObserving) {
			this.observe();
		}
	}

	/**
	 * @returns {void}
	 */
	observe() {
		if (!this.hasStarted) {
			this.hasStarted = true;
			this.onStart();
		}
		this.disconnect();
		this.observer = new MutationObserver((mutations, observer) => {
			this.onMutation(mutations, observer, this);
		});
		this.observer.observe(this.element, this.options);
		this.isObserving = true;
	}

	/**
	 * @returns {void}
	 */
	disconnect() {
		this.observer?.disconnect();
		this.isObserving = false;
	}

	/**
	 * @returns {MutationRecord[]}
	 */
	takeRecords() {
		return this.observer?.takeRecords();
	}
}
