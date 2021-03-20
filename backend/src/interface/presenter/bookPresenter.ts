import { Book } from 'src/domain/model';
import { IBookPresenter } from 'src/usecases';

export default class BookPresenter implements IBookPresenter {
  findByISBN(book: Book): Book {
    return book;
  }

  findAll(books: Book[]): Book[] {
    return books;
  }
}
