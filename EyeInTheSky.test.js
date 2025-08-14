import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EyeInTheSky from "./EyeInTheSky.js";

describe("EyeInTheSky", () => {
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("calls onStart when observation begins", () => {
		const onStart = vi.fn();
		const onMutation = vi.fn();

		const observer = new EyeInTheSky({
			element: container,
			onMutation,
			onStart,
		});

		observer.observe();
		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it("calls onMutation when a child is added", async () => {
		const onMutation = vi.fn();
		const observer = new EyeInTheSky({
			element: container,
			onMutation,
		});

		observer.observe();

		// Trigger DOM change
		const child = document.createElement("p");
		container.appendChild(child);

		// Wait for MutationObserver callback to fire
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onMutation).toHaveBeenCalledTimes(1);
		expect(onMutation.mock.calls[0][0][0].type).toBe("childList");
	});

	it("respects useDefaultOptions = false", () => {
		const onMutation = vi.fn();
		const observer = new EyeInTheSky({
			element: container,
			onMutation,
			options: { attributes: true },
			useDefaultOptions: false,
		});

		expect(observer.options).toEqual({ attributes: true });
	});

	it("merges defaultOptions when useDefaultOptions is true", () => {
		const onMutation = vi.fn();
		const observer = new EyeInTheSky({
			element: container,
			onMutation,
			options: { attributes: true },
			useDefaultOptions: true,
		});

		expect(observer.options).toEqual({
			childList: true,
			subtree: true,
			attributes: true,
		});
	});

	it("changing options while observing restarts observer", () => {
		const obsSpy = vi.spyOn(MutationObserver.prototype, "observe");

		const observer = new EyeInTheSky({
			element: container,
			onMutation: () => {},
			startImmediately: true,
		});

		observer.options = { attributes: true };
		expect(obsSpy).toHaveBeenCalledTimes(2); // initial + after change

		obsSpy.mockRestore();
	});

	it("changing useDefaultOptions while observing restarts observer", () => {
		const obsSpy = vi.spyOn(MutationObserver.prototype, "observe");

		const observer = new EyeInTheSky({
			element: container,
			onMutation: () => {},
			options: {
				childList: true,
			},
			startImmediately: true,
		});

		observer.useDefaultOptions = false;
		expect(obsSpy).toHaveBeenCalledTimes(2); // initial + after change

		obsSpy.mockRestore();
	});

	it("takeRecords returns an array", () => {
		const observer = new EyeInTheSky({
			element: container,
			onMutation: () => {},
		});

		observer.observe();
		const records = observer.takeRecords();
		expect(Array.isArray(records)).toBe(true);
	});

	it("throws if element is not an HTMLElement", () => {
		expect(() => {
			new EyeInTheSky({
				element: null,
				onMutation: vi.fn(),
			});
		}).toThrow(TypeError);
	});
});
