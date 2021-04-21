import { LocalBook, Book } from 'src/domain/model';
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
import IMetadataProviderCore from '../interfaces/metadataProvider';

export type RegisterBookInputData = Omit<LocalBook & {
  isLoan: boolean, amount: number,
}, 'id' | 'library'>;

export default class BookInteractor {
  private bookRepository: IBookRepository;

  private libraryInteractor: LibraryInteractor;

  private movementInteractor: MovementInteractor;

  private bookPresenter: IBookPresenter;

  private metadataProvider: IMetadataProviderCore;

  private logger: ILogger;

  constructor(
    bookRepository: IBookRepository,
    bookPresenter: IBookPresenter,
    libraryInteractor: LibraryInteractor,
    metadataProvider: IMetadataProviderCore,
    movementInteractor: MovementInteractor,
    logger: ILogger,
  ) {
    this.bookRepository = bookRepository;
    this.bookPresenter = bookPresenter;
    this.libraryInteractor = libraryInteractor;
    this.metadataProvider = metadataProvider;
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
      const message = 'Library not found';
      this.logger.error(
        message, {
          bookData, logger: 'BookInteractor:registerBook',
        },
      );
      throw new NotFoundError(message);
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
    } else if (existLocalBook) {
      result = existLocalBook[0].id;
    }

    // Register the inventory movement
    // TODO: also save the user and turn in which the movement was registered
    await this.movementInteractor.registerMovement({
      amount: bookData.amount, localBookId: result, isLoan: bookData.isLoan,
    });

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

    if (message !== '') {
      this.logger.error(
        message,
        { bookData, logger: 'bookInteractor' },
      );
      throw new InvalidDataError(message);
    }
  }

  async getBook(bookId: string): Promise<Book> {
    const localBook = await this.bookRepository.findById(bookId);
    console.log(localBook);
    if (!localBook) {
      this.logger.error('Local Book not found', { logger: 'bookInteractor:getbook', bookId });
      throw new NotFoundError('Local Book not found');
    }
    const remoteBook = await this.metadataProvider.getOneByISBN(localBook.isbn);
    console.log(remoteBook);
    if (!remoteBook) {
      this.logger.error('Remote Book not found', { logger: 'bookInteractor:getbook', isbn: localBook.isbn });
      throw new Error('Remote Book not found.');
    }
    return { ...localBook, ...remoteBook };
  }
}
