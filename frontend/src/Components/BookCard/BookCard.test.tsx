import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExternalBookFactory } from 'src/mocks/bookFactory';
import BookCard from '.';

describe('BookCard', () => {
  it('should render the BookCard with metadata', () => {
    const book = ExternalBookFactory.build();
    render(<BookCard book={book} />);

    const metaContainer = screen.getByTestId('card-meta');

    expect(screen.getByTestId('card-container')).toBeInTheDocument();
    expect(metaContainer).toBeInTheDocument();
    expect(screen.getByText(book.title)).toBeInTheDocument();
  });
});
