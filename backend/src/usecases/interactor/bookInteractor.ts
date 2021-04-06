import { wrapError } from 'src/@types';
import { Book, LocalBook } from 'src/domain/model';
import { IBookPresenter, IBookRepository, ILibraryRepository } from '..';
import { UnknownError } from '../errors';
import InvalidDataError from '../errors/invalidDataError';
import { ILogger } from '../interfaces/logger';

export default class BookInteractor {
  private bookRepository: IBookRepository;

  private libraryRepository: ILibraryRepository;

  private bookPresenter: IBookPresenter;

  private logger: ILogger;

  constructor(
    bookRepository: IBookRepository,
    bookPresenter: IBookPresenter,
    libraryRepository: ILibraryRepository,
    logger: ILogger,
  ) {
    this.bookRepository = bookRepository;
    this.bookPresenter = bookPresenter;
    this.libraryRepository = libraryRepository;
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
    bookData: Omit<LocalBook & { isLoan: boolean }, 'id' | 'library'>,
  ): Promise<LocalBook['id']> {
    if (bookData.price < 0) {
      const message = 'The book can not have a negative price.';
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new InvalidDataError(message);
    }

    if (!bookData.libraryId) {
      const message = 'The book needs a LibraryId.';
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new InvalidDataError(message);
    }

    const [libraryResult, libraryError] = await wrapError(
      this.libraryRepository.findOneByID(bookData.libraryId),
    );

    if (libraryError) {
      throw libraryError;
    }

    if ((libraryResult && libraryResult.id !== bookData.libraryId) || !libraryResult) {
      const message = 'Library not found.';
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new InvalidDataError(message);
    }

    const [bookResult, bookError] = await wrapError(
      this.bookRepository.registerBook(bookData),
    );

    if (bookError) {
      throw bookError;
    }

    if (!bookResult) {
      const message = 'Unknown error while registering book.';
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new UnknownError(message);
    }

    return bookResult;
  }
}
