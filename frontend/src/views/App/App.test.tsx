import React from 'react';
import { render, screen } from '@testing-library/react';
import { NavigationContextProvider } from 'src/hooks/navigation';
import App from './App';

test('renders cargó', () => {
  render(
    <NavigationContextProvider>
      <App />
    </NavigationContextProvider>,
  );
  const appContainer = screen.getByTestId('app');
  expect(appContainer).toBeInTheDocument();
});
