import { Book, LocalBook, LocalBookInput } from 'src/domain/model';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<LocalBook[]>;
  registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<LocalBook['id']>;
  listBooksByLibrary(
    page: number, perPage: number, libraryId?: string, isbn?:string,
  ): Promise<{ localBooks: LocalBook[], total: number }>;
  listBooksByIsbn(
    isbnId: string, page: number, perPage: number,
  ): Promise<{ localBooks: LocalBook[], total: number }>;
}
