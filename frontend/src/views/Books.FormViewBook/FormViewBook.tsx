import React from 'react';
import Props from './FormViewBook.type';

const FormViewBook: React.FC<Props> = ({ book, isLoading }) => {
  console.log(book.id);
  return (
    <table>das</table>
  );
};

export default FormViewBook;
