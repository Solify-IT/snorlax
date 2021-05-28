import { Library } from './library';
import CommonType from './common';
import Catalogue from './catalogue';

export type LocalBook = CommonType & {
  isbn: string,
  price: number,
  libraryId: string;
  library: Library;
  generos?: string[],
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
