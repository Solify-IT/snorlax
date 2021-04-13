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
      amount: bookData.amount, localBookId: result, isLoan: bookData.isLoan, type:'in',
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

  async updateBookAmount(libraryId: string, isbn: string, amount: number): Promise<LocalBook>{
    // TODO: Agregar movement type(Entrada o salida) a tabla de movimientos 

    //Check if book exists in library
    const [bookResult] = await Promise.all([
      this.bookRepository.getBookInLibrary(libraryId, isbn),
    ]);

    if (!bookResult){
      const message = 'Book not found in library';
      this.logger.error(
        message, {
          libraryId, logger: 'BookInteractor:updateBookAmount',
        }
      )
      throw new NotFoundError(message);
    }

    const result = await this.movementInteractor.registerMovement({amount,isLoan:false,localBookId:bookResult.id,type:'fix'});

    if (result) {
      return bookResult;
    }

      throw new UnknownError('unknown');
  }
}
