import { Book, LocalBook } from 'src/domain/model';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<Book>;
  registerBook(bookData: Omit<LocalBook, 'id'>): Promise<LocalBook['id']>;
}
