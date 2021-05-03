import { Pool } from 'pg';
import winston from 'winston';
import { wrapError } from 'src/@types';
import BookRepository from 'src/interface/repository/bookRepository';
import {
  BookInteractor,
  CatalogueInteractor,
  LibraryInteractor,
  MovementInteractor,
} from 'src/usecases/interactor';
import Datastore from 'src/infrastructure/datastore/datastore';
import { UnknownError, InvalidDataError } from 'src/usecases/errors';
import LibraryRepository from 'src/interface/repository/libraryRepository';
import LibraryFactory from 'src/infrastructure/factories/libraryFactory';
import {
  ExternalBookFactory,
  LocalBookFactory,
  CatalogueFactory,
} from 'src/infrastructure/factories';
import MovementRepository from 'src/interface/repository/movementRepository';
import NotFoundError from 'src/usecases/errors/notFoundError';
import { GoogleBooksService } from 'src/infrastructure/integrations';
import CatalogueRepository from 'src/interface/repository/catalogueRepository';

jest.mock('src/interface/repository/bookRepository');
jest.mock('src/interface/repository/catalogueRepository');
jest.mock('src/infrastructure/datastore/datastore');
jest.mock('src/infrastructure/integrations');
jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const validCatalogue = CatalogueFactory.build();
const logger = winston.createLogger();
const metadataProvider = new GoogleBooksService();
const datastore = new Datastore(new Pool(), logger);

const bookRepository = new BookRepository(datastore);
const libraryRepository = new LibraryRepository(datastore);
const movementRepository = new MovementRepository(datastore);
const catalogueRepository = new CatalogueRepository(datastore);
const libraryInteractor = new LibraryInteractor(libraryRepository, logger);
const catalogueInteractor = new CatalogueInteractor(catalogueRepository, logger);
const movementInteractor = new MovementInteractor(movementRepository, logger);

const interactor = new BookInteractor(
  bookRepository,
  libraryInteractor,
  movementInteractor,
  catalogueInteractor,
  metadataProvider,
  logger,
);

describe('registerBook', () => {
  it('should return book id when valid data is passed', async () => {
    const expectedID = 'expected';
    const library = LibraryFactory.build();
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementationOnce(async () => expectedID);
    jest.spyOn(
      catalogueRepository, 'findByISBNOrNull',
    ).mockImplementationOnce(async () => null);
    jest.spyOn(
      catalogueRepository, 'registerCatalogue',
    ).mockImplementationOnce(async () => validCatalogue);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementationOnce(async () => library);
    jest.spyOn(
      movementRepository, 'registerMovement',
    ).mockImplementationOnce(async () => expectedID);

    const [res, error] = await wrapError(
      interactor.registerBook({
        price: 10,
        isLoan: false,
        libraryId: library.id,
        amount: 10,
        ...validCatalogue,
      }),
    );

    expect(error).toBe(null);
    expect(res).toBe(expectedID);
  });

  it('should create new book catalogue when bookRepository.findByISBNOrNull returns null', async () => {
    expect.assertions(4);
    const expectedID = 'expected';
    const library = LibraryFactory.build();
    const registerCatalogueFn = jest.fn(async () => validCatalogue);
    const findByISBNOrNullFn = jest.fn(async () => null);
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementationOnce(async () => expectedID);
    jest.spyOn(
      catalogueRepository, 'findByISBNOrNull',
    ).mockImplementationOnce(findByISBNOrNullFn);
    jest.spyOn(
      catalogueRepository, 'registerCatalogue',
    ).mockImplementationOnce(registerCatalogueFn);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementationOnce(async () => library);
    jest.spyOn(
      movementRepository, 'registerMovement',
    ).mockImplementationOnce(async () => expectedID);

    const [res, error] = await wrapError(
      interactor.registerBook({
        price: 10,
        isLoan: false,
        libraryId: library.id,
        amount: 10,
        ...validCatalogue,
      }),
    );

    expect(error).toBe(null);
    expect(res).toBe(expectedID);
    expect(findByISBNOrNullFn).toBeCalledTimes(1);
    expect(registerCatalogueFn).toBeCalledTimes(1);
  });

  it('should throw InvalidDataError with negative price', async () => {
    const [res, error] = await wrapError(interactor.registerBook(
      {
        price: -10,
        isLoan: false,
        libraryId: 'id_library',
        amount: 10,
        ...validCatalogue,
      },
    ));

    expect(error).toBeInstanceOf(InvalidDataError);
    expect(res).toBe(null);
  });

  it('should throw UnknownError when no result got from interactor', async () => {
    const library = LibraryFactory.build();
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementationOnce(async () => { throw new UnknownError('unknown'); });
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementationOnce(async () => library);

    const [result, error] = await wrapError(interactor.registerBook(
      {
        price: 10,
        isLoan: false,
        libraryId: library.id,
        amount: 10,
        ...validCatalogue,
      },
    ));

    expect(error).toBeInstanceOf(UnknownError);
    expect(result).toBe(null);
  });

  it('should return the local book id when already registered on library', async () => {
    const library = LibraryFactory.build();
    const existingBooks = LocalBookFactory.buildList(2);
    existingBooks[0].libraryId = library.id;
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementationOnce(async () => existingBooks[0].id);
    jest.spyOn(
      bookRepository, 'findByISBN',
    ).mockImplementationOnce(async () => existingBooks);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementationOnce(async () => library);
    jest.spyOn(
      movementRepository, 'registerMovement',
    ).mockImplementationOnce(async () => 'movementID');

    const [result, error] = await wrapError(interactor.registerBook(
      {
        price: 10,
        isLoan: false,
        libraryId: library.id,
        amount: 10,
        ...validCatalogue,
      },
    ));

    expect(error).toBe(null);
    expect(result).toBe(existingBooks[0].id);
  });

  it('should throw error when amount of books is 0', async () => {
    const library = LibraryFactory.build();
    const existingBooks = LocalBookFactory.buildList(2);
    existingBooks[0].libraryId = library.id;
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementationOnce(async () => existingBooks[0].id);
    jest.spyOn(
      bookRepository, 'findByISBN',
    ).mockImplementationOnce(async () => existingBooks);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementationOnce(async () => library);

    const [result, error] = await wrapError(interactor.registerBook(
      {
        price: 10,
        isLoan: false,
        libraryId: library.id,
        amount: 0,
        ...validCatalogue,
      },
    ));

    expect(error).toBeInstanceOf(InvalidDataError);
    expect(result).toBe(null);
  });

  it('should throw error when amount of books is negative', async () => {
    const library = LibraryFactory.build();
    const existingBooks = LocalBookFactory.buildList(2);
    existingBooks[0].libraryId = library.id;
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementationOnce(async () => existingBooks[0].id);
    jest.spyOn(
      bookRepository, 'findByISBN',
    ).mockImplementationOnce(async () => existingBooks);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementationOnce(async () => library);

    const [result, error] = await wrapError(interactor.registerBook(
      {
        price: 10,
        isLoan: false,
        libraryId: library.id,
        amount: -10,
        ...validCatalogue,
      },
    ));

    expect(error).toBeInstanceOf(InvalidDataError);
    expect(result).toBe(null);
  });

  it('should throw NotFoundError when library is not found', async () => {
    const expectedID = 'expected';
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementationOnce(async () => expectedID);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementationOnce(async () => null);

    const [res, error] = await wrapError(
      interactor.registerBook({
        price: 10,
        isLoan: false,
        libraryId: 'notfound',
        amount: 10,
        ...validCatalogue,
      }),
    );

    expect(error).toBeInstanceOf(NotFoundError);
    expect(res).toBe(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('listBooksByLibrary', () => {
  it('should return the books and call the metadata provider for book information', async () => {
    const library = LibraryFactory.build();
    const LOCAL_BOOKS_AMOUNT = 3;
    const localBooksMock = LocalBookFactory.buildList(
      LOCAL_BOOKS_AMOUNT, { library, libraryId: library.id },
    );

    const listBooksByLibraryMock = jest.fn(async () => ({
      localBooks: localBooksMock, total: localBooksMock.length,
    }));
    const getOneByISBNMock = jest.fn(
      async (isbn: string) => ExternalBookFactory.build({ isbn }),
    );

    jest.spyOn(
      bookRepository, 'listBooksByLibrary',
    ).mockImplementationOnce(listBooksByLibraryMock);
    jest.spyOn(
      metadataProvider, 'getOneByISBN',
    ).mockImplementationOnce(getOneByISBNMock);

    const [res, err] = await wrapError(interactor.listBooksByLibrary(library.id));

    expect(err).toBe(null);
    expect(res).not.toBe(null);
    expect(listBooksByLibraryMock).toBeCalled();
    expect(getOneByISBNMock).toBeCalledTimes(LOCAL_BOOKS_AMOUNT);
  });

  it('should return empty array when no book is associated with the library id', async () => {
    const listBooksByLibraryMock = jest.fn(async () => ({ localBooks: [], total: 0 }));
    const getOneByISBNMock = jest.fn(
      async (isbn: string) => ExternalBookFactory.build({ isbn }),
    );

    jest.spyOn(
      bookRepository, 'listBooksByLibrary',
    ).mockImplementationOnce(listBooksByLibraryMock);
    jest.spyOn(
      metadataProvider, 'getOneByISBN',
    ).mockImplementationOnce(getOneByISBNMock);

    const [res, err] = await wrapError(interactor.listBooksByLibrary('anUUID'));

    expect(err).toBe(null);
    expect(res).not.toBe(null);
    expect(res?.books).toHaveLength(0);
    expect(listBooksByLibraryMock).toBeCalled();
    expect(getOneByISBNMock).not.toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
