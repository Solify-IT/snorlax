import { Book, LocalBook, LocalBookInput } from 'src/domain/model';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<LocalBook[]>;
  registerBook(bookData: Omit<LocalBookInput, 'id'>): Promise<LocalBook['id']>;
  getBookInLibrary(libraryId: string, isbn: string): Promise<LocalBook>;
  listBooksByLibrary(
    libraryId: string, page: number, perPage: number,
  ): Promise<{ localBooks: LocalBook[], total: number }>;
}
