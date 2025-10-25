import '@testing-library/jest-dom';

// Guard against noisy extension-related console errors during tests
const originalError = console.error;
// eslint-disable-next-line no-console
console.error = (...args) => {
  const msg = args?.[0];
  if (typeof msg === 'string' && (msg.includes('ResizeObserver') || msg.includes('Extension context'))) {
    return;
  }
  originalError(...args);
};
