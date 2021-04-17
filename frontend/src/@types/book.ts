import { Library } from './library';
import CommonType from './common';

export type LocalBook = CommonType & {
  isbn: string,
  price: number,
  libraryId: string;
  library: Library;
  generos?: string[],
};

export type LocalBookInput = Omit<LocalBook, 'library'>;

export type ExternalBook = {
  authors: string[],
  coverURL: string,
  title: string,
  isbn?: string,
};

export type Book = LocalBook & ExternalBook;

export const BOOK_TABLE_NAME = 'local_books';
