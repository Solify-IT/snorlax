import { wrapError } from 'src/@types';
import BookInteractor from 'src/usecases/interactor/bookInteractor';
import { IContext } from './context';

export default class BookController {
  bookInteractor: BookInteractor;

  constructor(bookInteractor: BookInteractor) {
    this.bookInteractor = bookInteractor;
  }

  async getBooks(context: IContext): Promise<void> {
    const [books, error] = await wrapError(this.bookInteractor.getAll());

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json(books);
  }
}
