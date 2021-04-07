import { wrapError } from 'src/@types';
import { LocalBook } from 'src/domain/model';
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

  // POST /books { bookData }
  async registerBook(context: IContext): Promise<void> {
    const {
      isLoan,
      isbn,
      libraryId,
      price,
    } = context.request.body;

    const bookData: Omit<LocalBook & { isLoan: boolean }, 'id' | 'library'> = {
      isLoan: JSON.parse(isLoan),
      isbn,
      libraryId,
      price: JSON.parse(price),
    };

    const [bookId, error] = await wrapError(
      this.bookInteractor.registerBook(bookData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ bookId });
  }
}
