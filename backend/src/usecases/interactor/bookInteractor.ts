import { LocalBook } from 'src/domain/model';
import {
  IBookPresenter,
  IBookRepository,
} from '..';
import { UnknownError } from '../errors';
import InvalidDataError from '../errors/invalidDataError';
import NotFoundError from '../errors/notFoundError';
import { ILogger } from '../interfaces/logger';
import LibraryInteractor from './libraryInteractor';
import MovementInteractor from './movementInteractor';

export type RegisterBookInputData = Omit<LocalBook & {
  isLoan: boolean, amount: number,
}, 'id' | 'library'>;

export default class BookInteractor {
  private bookRepository: IBookRepository;

  private libraryInteractor: LibraryInteractor;

  private movementInteractor: MovementInteractor;

  private bookPresenter: IBookPresenter;

  private logger: ILogger;

  constructor(
    bookRepository: IBookRepository,
    bookPresenter: IBookPresenter,
    libraryInteractor: LibraryInteractor,
    movementInteractor: MovementInteractor,
    logger: ILogger,
  ) {
    this.bookRepository = bookRepository;
    this.bookPresenter = bookPresenter;
    this.libraryInteractor = libraryInteractor;
    this.movementInteractor = movementInteractor;
    this.logger = logger;
  }

  async registerBook(
    bookData: RegisterBookInputData,
  ): Promise<LocalBook['id']> {
    this.validateRegisterBookData(bookData);

    // Check if the library exists and if already is registered the book in the library
    const [libraryResult, existLocalBook] = await Promise.all([
      this.libraryInteractor.getOneById(bookData.libraryId),
      this.bookRepository.findByISBN(bookData.isbn),
    ]);

    if (!libraryResult) {
      throw new NotFoundError('Library not found');
    }

    const shouldSaveNewLocalBook = (
      existLocalBook && existLocalBook.every(
        (book) => book.libraryId !== bookData.libraryId,
      )
    ) || !existLocalBook;

    let result = '';

    if (shouldSaveNewLocalBook) {
      result = await this.bookRepository.registerBook({
        isbn: bookData.isbn, price: bookData.price, libraryId: bookData.libraryId,
      });
    }

    if (result !== '') return result;

    throw new UnknownError('unknown');
  }

  private validateRegisterBookData(bookData: RegisterBookInputData): void {
    let message = '';

    if (bookData.price < 0) {
      message += 'The book can not have a negative price. ';
    }

    if (!bookData.libraryId) {
      message += 'The book needs a LibraryId. ';
    }

    if (bookData.amount <= 0) {
      message += 'The amount of books must be greater than 0. ';
    }

    if (message !== '') {
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new InvalidDataError(message);
    }
  }
}
