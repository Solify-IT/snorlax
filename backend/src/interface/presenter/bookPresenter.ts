import { Book } from 'src/domain/model';
import { IBookPresenter } from 'src/usecases';

export default class BookPresenter implements IBookPresenter {
  findAll(books: Book[]): Book[] {
    return books;
  }
}
