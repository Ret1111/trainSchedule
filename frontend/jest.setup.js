import '@testing-library/jest-dom';

const mockRouter = {
  push: jest.fn(),
  pathname: '',
};

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

// Mock axios
jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = Boolean(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in the document`,
        pass: false,
      };
    }
  },
}); 