import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cargó', () => {
  render(<App />);
  const linkElement = screen.getByText(/cargó/i);
  expect(linkElement).toBeInTheDocument();
});
