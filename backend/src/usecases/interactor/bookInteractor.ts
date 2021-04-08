import { wrapError } from 'src/@types';
import { LocalBook } from 'src/domain/model';
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

    const [existLocalBook, existLocalBookErr] = await wrapError(
      this.bookRepository.findByISBN(bookData.isbn),
    );

    if (existLocalBookErr) {
      throw existLocalBookErr;
    }

    // TODO: validate duplicated books on libraries
    if (
      (existLocalBook
      && existLocalBook.every((book) => book.libraryId !== bookData.libraryId))
      || !existLocalBook
    ) {
      const [bookResult, bookError] = await wrapError(
        this.bookRepository.registerBook({
          isbn: bookData.isbn, price: bookData.price, libraryId: bookData.libraryId,
        }),
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

    throw new UnknownError('unknown');
  }
}
