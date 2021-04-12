import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './index';

describe('Loader component', () => {
  it('should show the loader component when is loading', () => {
    render(<Loader isLoading />);
    const component = screen.getByTestId('loader');
    expect(component).toBeInTheDocument();
  });

  it('should not show the loader component when is not loading', () => {
    render(<Loader isLoading={false} />);
    const component = screen.queryByTestId('loader');
    expect(component).not.toBeInTheDocument();
  });
});
