import { Book } from 'src/domain/model';

export interface IBookPresenter {
  findAll(books: Book[]): Book[];
  findByISBN(book: Book): Book;
}
