import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cargó', () => {
  render(<App />);
  const appContainer = screen.getByTestId('app');
  expect(appContainer).toBeInTheDocument();
});
