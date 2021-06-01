import CommonType from './common';
import Catalogue from './catalogue';
import { Library } from './library';

export type LocalBook = CommonType & {
  isbn: string,
  price: number,
  libraryId: string
  library: Library;
  amount: number;
};

export type LocalBookInput = Omit<LocalBook, 'library'>;

export type SaleInput = {
  id: string,
  amount: number,
};

export type SaleMovementInput = {
  books: SaleInput[];
};

export type ExternalBook = {
  authors: string[],
  title: string,
  isbn?: string,
};

export type Book = LocalBook & Catalogue;

export const BOOK_TABLE_NAME = 'local_books';
