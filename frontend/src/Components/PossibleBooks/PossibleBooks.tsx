import React from 'react';
import { Props } from './PossibleBooks.type';

const PossibleBooks: React.FC<Props> = ({ books }) => (
  <>
    {books.length > 0 ? <div>{books[0].title}</div> : 'No se encontraron metadatos'}
  </>
);

export default PossibleBooks;
