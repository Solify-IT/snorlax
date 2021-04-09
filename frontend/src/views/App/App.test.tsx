import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cargó', () => {
  render(<App />);
  const linkElement = screen.getByText(/Renders App/i);
  expect(linkElement).toBeInTheDocument();
});
