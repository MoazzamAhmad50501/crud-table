module.exports = {
  root: true, // Indicates this config is the root ESLint config

  env: {
    browser: true, // Enables browser global variables and browser APIs
    es2021: true, // Enables ES2021 globals
    node: true, // Enables Node.js global variables and Node.js scoping
  },

  parserOptions: {
    ecmaVersion: 12, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  extends: [
    'eslint:recommended', // Uses ESLint's recommended rule set
  ],
  rules: {
    // Best Practices
    'no-unused-vars': 'warn', // Warns about unused variables
    'no-undef': 'error', // Disallows the use of undeclared variables
    eqeqeq: 'error', // Enforces the use of === and !==
    'no-eval': 'error', // Disallows the use of eval()

    // Stylistic Issues
    indent: ['error', 2], // Enforces 2-space indentation
    quotes: ['error', 'single'], // Enforces the use of single quotes
    semi: ['error', 'always'], // Enforces the use of semicolons
    'comma-spacing': 'error', // Enforces consistent spacing after commas
    'space-before-blocks': 'error', // Enforces consistent spacing before blocks
  },
};
