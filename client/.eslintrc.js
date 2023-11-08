module.exports = {
  parserOptions: {
    ecmaVersion: 2021, // Use the latest ECMAScript version
    sourceType: "module", // Use ECMAScript modules
    ecmaFeatures: {
      jsx: true, // Enable JSX support
    },
  },
  extends: [
    "eslint:recommended", // Use ESLint recommended rules
    "plugin:react/recommended", // Use recommended React rules
  ],
  plugins: [
    "react", // Enable React plugin
  ],
  //Ignore props validation  errors
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",

    // Add your project-specific rules here
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
};
