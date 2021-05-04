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

export type ExternalBook = Omit<Catalogue, 'id'>;

export type BookFormType = Omit<Catalogue, 'id' | 'createdAt' | 'updatedAt'>
& Omit<LocalBookInput, 'id' | 'createdAt' | 'updatedAt' | 'libraryId'>;

export type Book = LocalBook & ExternalBook;

export const BOOK_TABLE_NAME = 'local_books';
