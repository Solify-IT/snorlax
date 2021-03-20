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

  // GET /books/:isbn

  async getBookByISBN(context: IContext): Promise<void> {
    const { isbn } = context.request.params;
    const [book, error] = await wrapError(
      this.bookInteractor.getByISBN(isbn),
    );

    if (error) {
      context.next(error);
    }

    context.response.status(200).json(book);
  }
}
