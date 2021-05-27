import React from 'react';
import { render, screen } from '@testing-library/react';
import { NavigationContextProvider } from 'src/hooks/navigation';
import { AuthContextProvider } from 'src/hooks/auth';
import App from './App';

test('renders cargó', () => {
  render(
    <NavigationContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </NavigationContextProvider>,
  );
  const appContainer = screen.getByTestId('app');
  expect(appContainer).toBeInTheDocument();
});
