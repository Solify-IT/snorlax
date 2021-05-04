import { Maybe } from 'src/@types';
import { Book, LocalBook, LocalBookInput } from 'src/domain/model';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<LocalBook[]>;
  findById(id: string): Promise<Maybe<LocalBook>>;
  registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<LocalBook['id']>;
  listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?:string,
  ): Promise<{ localBooks: LocalBook[], total: number }>;
}
