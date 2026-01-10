import '@testing-library/jest-dom';

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn(() => Promise.resolve())
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: jest.fn()
});

if (typeof (global as typeof globalThis & { ResizeObserver?: unknown }).ResizeObserver === 'undefined') {
    (global as typeof globalThis & { ResizeObserver: unknown }).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
