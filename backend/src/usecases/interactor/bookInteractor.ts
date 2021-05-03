import {
  LocalBook, Book, CatalogueInputData, Catalogue,
} from 'src/domain/model';
import { Maybe } from 'src/@types';
import { IBookRepository } from '..';
import { UnknownError } from '../errors';
import InvalidDataError from '../errors/invalidDataError';
import NotFoundError from '../errors/notFoundError';
import { ILogger } from '../interfaces/logger';
import IMetadataProviderCore from '../interfaces/metadataProvider';
import LibraryInteractor from './libraryInteractor';
import MovementInteractor from './movementInteractor';
import CatalogueInteractor from './catalogueInteractor';

export type RegisterBookInputData = Omit<LocalBook & {
  isLoan: boolean, amount: number,
} & CatalogueInputData, 'id' | 'library'>;

export default class BookInteractor {
  private bookRepository: IBookRepository;

  private libraryInteractor: LibraryInteractor;

  private movementInteractor: MovementInteractor;

  catalogueInteractor: CatalogueInteractor;

  private metadataProvider: IMetadataProviderCore;

  private logger: ILogger;

  constructor(
    bookRepository: IBookRepository,
    libraryInteractor: LibraryInteractor,
    movementInteractor: MovementInteractor,
    catalogueInteractor: CatalogueInteractor,
    metadataProvider: IMetadataProviderCore,
    logger: ILogger,
  ) {
    this.bookRepository = bookRepository;
    this.libraryInteractor = libraryInteractor;
    this.movementInteractor = movementInteractor;
    this.catalogueInteractor = catalogueInteractor;
    this.metadataProvider = metadataProvider;
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

    this.createInCatalogueIfNotExists(catalogue, bookData);

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

  async listBooksByLibrary(
    libraryId: string, page: number = 1, perPage: number = 10,
  ): Promise<{ books: Book[], total: number }> {
    const { localBooks, total } = await this.bookRepository.listBooksByLibrary(
      libraryId, page, perPage,
    );
    const books: Book[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const book of localBooks) {
      // eslint-disable-next-line no-await-in-loop
      const remoteBook = await this.metadataProvider.getOneByISBN(book.isbn);

      if (remoteBook) {
        books.push({
          ...book, ...remoteBook,
        });
      }
    }

    return { books, total };
  }

  private createInCatalogueIfNotExists(
    catalogue: Maybe<Catalogue>, bookData: RegisterBookInputData,
  ): void {
    if (!catalogue) {
      this.catalogueInteractor.registerCatalogue({
        area: bookData.area,
        author: bookData.area,
        collection: bookData.collection,
        cover: bookData.collection,
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
      });
    }
  }
}
