import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Observatory from "./observatory.js";

describe("Observatory", () => {
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("throws a TypeError if element is not an HTMLElement", () => {
		expect(() => {
			new Observatory({
				element: null,
				onMutation: vi.fn(),
			});
		}).toThrow(TypeError);
	});

	it("throws a TypeError if onMutation is not a Function", () => {
		expect(() => {
			new Observatory({
				element: container,
				onMutation: null,
			});
		}).toThrow(TypeError);
	});

	it("calls onStart only once after observation starts", () => {
		const onStart = vi.fn();

		const watcher = new Observatory({
			element: container,
			onMutation: () => {},
			onStart,
		});

		expect(onStart).toHaveBeenCalledTimes(0);

		watcher.observe();
		watcher.disconnect();
		watcher.observe();

		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it("calls onMutation when a mutation is observed", async () => {
		const onMutation = vi.fn();
		const watcher = new Observatory({
			element: container,
			onMutation,
		});

		watcher.observe();

		const child = document.createElement("p");
		container.appendChild(child);

		// Wait for onMutation to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onMutation).toHaveBeenCalledTimes(1);
		expect(onMutation.mock.calls[0][0][0].type).toBe("childList");
	});

	it("respects useDefaultOptions = false", () => {
		const onMutation = vi.fn();
		const watcher = new Observatory({
			element: container,
			onMutation,
			options: { attributes: true },
			useDefaultOptions: false,
		});

		expect(watcher.options).toEqual({ attributes: true });
	});

	it("merges defaultOptions when useDefaultOptions = true", () => {
		const onMutation = vi.fn();
		const watcher = new Observatory({
			element: container,
			onMutation,
			options: { attributes: true },
		});

		expect(watcher.options).toEqual({
			childList: true,
			subtree: true,
			attributes: true,
		});
	});

	it("changing options while observing triggers observe only if values change", () => {
		const spy = vi.spyOn(MutationObserver.prototype, "observe");

		const watcher = new Observatory({
			element: container,
			onMutation: () => {},
			startImmediately: true,
		});

		// triggers observe because value has changed
		watcher.options = { attributes: true };
		expect(spy).toHaveBeenCalledTimes(2);

		// does not trigger observe because value has not changed
		watcher.options = { attributes: true };
		expect(spy).toHaveBeenCalledTimes(2);

		// triggers observe because value has changed
		watcher.options = { childList: true };
		expect(spy).toHaveBeenCalledTimes(3);

		spy.mockRestore();
	});

	it("changing useDefaultOptions while observing triggers observe only if values change", () => {
		const spy = vi.spyOn(MutationObserver.prototype, "observe");

		const watcher = new Observatory({
			element: container,
			onMutation: () => {},
			startImmediately: true,
			options: { attributes: true },
		});

		// triggers observe because value has changed
		watcher.useDefaultOptions = false;
		expect(spy).toHaveBeenCalledTimes(2);

		// does not trigger observe because value has not changed
		watcher.useDefaultOptions = false;
		expect(spy).toHaveBeenCalledTimes(2);

		// triggers observe because value has changed
		watcher.useDefaultOptions = true;
		expect(spy).toHaveBeenCalledTimes(3);

		spy.mockRestore();
	});

	it("takeRecords returns an array", () => {
		const watcher = new Observatory({
			element: container,
			onMutation: () => {},
		});

		watcher.observe();

		const records = watcher.takeRecords();
		expect(Array.isArray(records)).toBe(true);
	});
});
