import { Book } from 'src/domain/model';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByISBN(isbn: string): Promise<Book>;
}
