module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'react/prop-types': ['off'],
    'react/jsx-props-no-spreading': ['off']
  }
};

