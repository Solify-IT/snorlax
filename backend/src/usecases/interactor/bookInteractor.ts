import { wrapError } from 'src/@types';
import { Book, LocalBook } from 'src/domain/model';
import { IBookPresenter, IBookRepository } from '..';
import { UnknownError } from '../errors';
import InvalidDataError from '../errors/invalidDataError';
import { ILogger } from '../interfaces/logger';

export default class BookInteractor {
  private bookRepository: IBookRepository;

  private bookPresenter: IBookPresenter;

  private logger: ILogger;

  constructor(
    bookRepository: IBookRepository,
    bookPresenter: IBookPresenter,
    logger: ILogger,
  ) {
    this.bookRepository = bookRepository;
    this.bookPresenter = bookPresenter;
    this.logger = logger;
  }

  async getAll(): Promise<Book[]> {
    const [books, error] = await wrapError(this.bookRepository.findAll());

    if (error) {
      throw error;
    }

    if (!books) {
      const message = 'Unknown error while getting all books.';
      this.logger.error(
        message,
        { books, logger: 'bookInteractor' },
      );
      throw new UnknownError(message);
    }

    return this.bookPresenter.findAll(books);
  }

  async getByISBN(isbn: string): Promise<Book> {
    const [book, error] = await wrapError(
      this.bookRepository.findByISBN(isbn),
    );

    if (error) {
      throw error;
    }

    if (!book) {
      const message = 'Unknown error while searching by ISBN.';
      this.logger.error(
        message,
        { isbn, logger: 'bookInteractor' },
      );
      throw new UnknownError(message);
    }

    return this.bookPresenter.findByISBN(book);
  }

  async registerBook(
    bookData: Omit<LocalBook & { isLoan: boolean }, 'id'>,
  ): Promise<LocalBook['id']> {
    if (bookData.price < 0) {
      const message = 'The book can not have a negative price.';
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new InvalidDataError(message);
    }

    const [result, error] = await wrapError(
      this.bookRepository.registerBook(bookData),
    );

    if (error) {
      throw error;
    }

    if (!result) {
      const message = 'Unknown error while registering book.';
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new UnknownError(message);
    }

    return result;
  }
}
