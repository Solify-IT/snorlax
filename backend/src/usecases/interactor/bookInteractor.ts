/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  LocalBook, Book, CatalogueInputData, Catalogue, LocalBookInput,
} from 'src/domain/model';
import { Maybe } from 'src/@types';
import { SaleMovementInput, ReturnMovementInput } from 'src/domain/model/book';
import { IBookRepository } from '..';
import { UnknownError } from '../errors';
import InvalidDataError from '../errors/invalidDataError';
import NotFoundError from '../errors/notFoundError';
import { ILogger } from '../interfaces/logger';
import LibraryInteractor from './libraryInteractor';
import MovementInteractor from './movementInteractor';
import CatalogueInteractor from './catalogueInteractor';

export type RegisterBookInputData = Omit<LocalBook & {
  isLoan: boolean, amount: number,
} & CatalogueInputData, 'id' | 'library'>;

export default class BookInteractor {
  [x: string]: any;

  private bookRepository: IBookRepository;

  private libraryInteractor: LibraryInteractor;

  private movementInteractor: MovementInteractor;

  catalogueInteractor: CatalogueInteractor;

  private logger: ILogger;

  constructor(
    bookRepository: IBookRepository,
    libraryInteractor: LibraryInteractor,
    movementInteractor: MovementInteractor,
    catalogueInteractor: CatalogueInteractor,
    logger: ILogger,
  ) {
    this.bookRepository = bookRepository;
    this.libraryInteractor = libraryInteractor;
    this.movementInteractor = movementInteractor;
    this.catalogueInteractor = catalogueInteractor;
    this.logger = logger;
  }

  async registerBook(
    bookData: RegisterBookInputData,
  ): Promise<LocalBook['id']> {
    this.validateRegisterBookData(bookData);

    // Check if the library exists and if already is registered the book in the library
    const [libraryResult, existLocalBook, catalogue] = await Promise.all([
      this.libraryInteractor.getOneById(bookData.libraryId),
      this.bookRepository.findByISBN(bookData.isbn),
      this.catalogueInteractor.findByISBNOrNull(bookData.isbn),
    ]);

    await this.createInCatalogueIfNotExists(catalogue, bookData);

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
        isbn: bookData.isbn,
        price: bookData.price,
        libraryId: bookData.libraryId,
        amount: bookData.amount,
      });
    } else if (existLocalBook) {
      result = existLocalBook[0].id;
      await this.bookRepository.updateBook({
        id: result,
        isbn: bookData.isbn,
        price: bookData.price,
        libraryId: bookData.libraryId,
        amount: parseInt(bookData.amount as unknown as string, 10) + parseInt(
          existLocalBook[0].amount as unknown as string, 10,
        ),
      });
    }

    // Register the inventory movement
    // TODO: also save the user and turn in which the movement was registered
    await this.movementInteractor.registerMovement({
      amount: bookData.amount, localBookId: result, isLoan: bookData.isLoan, total: bookData.price, type: 'Compra',
    });

    if (result !== '') return result;

    throw new UnknownError('unknown');
  }

  async registerBooksSell(
    saleData: SaleMovementInput,
  ): Promise<void> {
    this.logger.info('Creating new sale.', { logger: 'BookInteractor:registerBooksSell' });

    const modified: SaleMovementInput = { books: [] };

    for (const book of saleData.books) {
      let existing: LocalBook;
      try {
        existing = await this.getBook(book.id);
        await this.updateBookAmount({
          id: book.id,
          isbn: existing.isbn,
          libraryId: existing.libraryId,
          price: existing.price,
          amount: existing.amount - book.amount,
        }, false);
        modified.books.push(book);
      } catch (e) {
        this.logger.error({ message: 'Libro no encontrado al realizar la venta', bookId: book.id });
      }
    }

    await this.bookRepository.registerBooksSell(modified);
  }

  async registerBooksReturnEditorial(
    returnData: ReturnMovementInput,
  ): Promise<void> {
    this.logger.info('Creating new Return.', { logger: 'BookInteractor:registerBooksReturnEditorial' });

    const modified: ReturnMovementInput = { books: [] };

    for (const book of returnData.books) {
      let existing: LocalBook;
      try {
        existing = await this.getBook(book.id);
        await this.updateBookAmount({
          id: book.id,
          isbn: existing.isbn,
          libraryId: existing.libraryId,
          price: existing.price,
          amount: existing.amount - book.amount,
        }, false);
        modified.books.push(book);
      } catch (e) {
        this.logger.error({ message: 'Libro no encontrado al realizar la venta', bookId: book.id });
      }
    }

    await this.bookRepository.registerBooksReturnEditorial(modified);
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

  async updateBookAmount(
    bookData: LocalBookInput, saveMovement: boolean = true,
  ): Promise<LocalBook> {
    const book = await this.getBook(bookData.id);

    if (!book) {
      const message = 'Book not found in library';
      this.logger.error(
        message, {
          bookData, logger: 'BookInteractor:updateBookAmount',
        },
      );
      throw new NotFoundError(message);
    }

    const [bookResult] = await Promise.all([
      this.bookRepository.updateBook(bookData),
    ]);

    if (!saveMovement) return bookResult;

    const amount = Math.abs(book.amount - bookData.amount);
    if (amount) {
      await this.movementInteractor.registerMovement({
        amount, isLoan: false, localBookId: bookData.id, total: bookData.price, type: 'Actualizar',
      });
    }

    return bookResult;
  }

  async listBooksByLibrary(
    page: number = 1, perPage: number = 10, libraryId?: string, isbn?: string,
  ): Promise<{ books: Book[], total: number }> {
    const { localBooks, total } = await this.bookRepository.listBooksByLibrary(
      page, perPage, libraryId, isbn,
    );

    return { books: localBooks, total };
  }

  private async createInCatalogueIfNotExists(
    catalogue: Maybe<Catalogue>, bookData: RegisterBookInputData,
  ): Promise<void> {
    if (!catalogue) {
      await this.catalogueInteractor.registerCatalogue({
        area: bookData.area,
        author: bookData.author,
        collection: bookData.collection,
        coverType: bookData.coverType,
        coverImageUrl: bookData.coverImageUrl,
        distribuitor: bookData.distribuitor,
        editoral: bookData.editoral,
        isbn: bookData.isbn,
        pages: bookData.pages,
        provider: bookData.provider,
        subCategory: bookData.subCategory,
        subTheme: bookData.subTheme,
        synopsis: bookData.synopsis,
        theme: bookData.theme,
        title: bookData.title,
        type: bookData.type,
        unitaryCost: bookData.unitaryCost,
        libraryName: bookData.libraryName,
        libraryPhone: bookData.libraryPhone,
      });
    }
  }

  async getBook(bookId: string): Promise<LocalBook> {
    const localBook = await this.bookRepository.findById(bookId);
    if (!localBook) {
      this.logger.error('Local Book not found', { logger: 'bookInteractor:getbook', bookId });
      throw new NotFoundError('Local Book not found');
    }
    return localBook;
  }
}
