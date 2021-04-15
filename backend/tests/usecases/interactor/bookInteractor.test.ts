import { Pool } from 'pg';
import winston from 'winston';
import { wrapError } from 'src/@types';
import BookPresenter from 'src/interface/presenter/bookPresenter';
import BookRepository from 'src/interface/repository/bookRepository';
import { BookInteractor, LibraryInteractor, MovementInteractor } from 'src/usecases/interactor';
import Datastore from 'src/infrastructure/datastore/datastore';
import { UnknownError, InvalidDataError } from 'src/usecases/errors';
import LibraryRepository from 'src/interface/repository/libraryRepository';
import LibraryFactory from 'src/infrastructure/factories/libraryFactory';
import { LocalBookFactory } from 'src/infrastructure/factories';
import MovementRepository from 'src/interface/repository/movementRepository';
import NotFoundError from 'src/usecases/errors/notFoundError';
import { GoogleBooksService } from 'src/infrastructure/integrations';

jest.mock('src/interface/presenter/bookPresenter');
jest.mock('src/interface/repository/bookRepository');
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

describe('registerBook', () => {
  const logger = winston.createLogger();
  const bookRepository = new BookRepository(new Datastore(new Pool(), logger));
  const libraryRepository = new LibraryRepository(new Datastore(new Pool(), logger));
  const movementRepository = new MovementRepository(new Datastore(new Pool(), logger));
  const presenter = new BookPresenter();
  const libraryInteractor = new LibraryInteractor(libraryRepository, logger);
  const movementInteractor = new MovementInteractor(movementRepository, logger);
  const metadataProvider = new GoogleBooksService();

  const interactor = new BookInteractor(
    bookRepository,
    presenter,
    libraryInteractor,
    movementInteractor,
    metadataProvider,
    logger,
  );

  it('should return book id when valid data is passed', async () => {
    const expectedID = 'expected';
    const library = LibraryFactory.build();
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementation(async () => expectedID);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementation(async () => library);
    jest.spyOn(
      movementRepository, 'registerMovement',
    ).mockImplementation(async () => expectedID);

    const [res, error] = await wrapError(
      interactor.registerBook({
        isbn: '123', price: 10, isLoan: false, libraryId: library.id, amount: 10,
      }),
    );

    expect(error).toBe(null);
    expect(res).toBe(expectedID);
  });

  it('should throw InvalidDataError with negative price', async () => {
    const [res, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: -10, isLoan: false, libraryId: 'id_library', amount: 10,
      },
    ));

    expect(error).toBeInstanceOf(InvalidDataError);
    expect(res).toBe(null);
  });

  it('should throw UnknownError when no result got from interactor', async () => {
    const library = LibraryFactory.build();
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementation(async () => { throw new UnknownError('unknown'); });
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementation(async () => library);

    const [result, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: 10, isLoan: false, libraryId: library.id, amount: 10,
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
    ).mockImplementation(async () => existingBooks[0].id);
    jest.spyOn(
      bookRepository, 'findByISBN',
    ).mockImplementation(async () => existingBooks);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementation(async () => library);
    jest.spyOn(
      movementRepository, 'registerMovement',
    ).mockImplementation(async () => 'movementID');

    const [result, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: 10, isLoan: false, libraryId: library.id, amount: 10,
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
    ).mockImplementation(async () => existingBooks[0].id);
    jest.spyOn(
      bookRepository, 'findByISBN',
    ).mockImplementation(async () => existingBooks);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementation(async () => library);

    const [result, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: 10, isLoan: false, libraryId: library.id, amount: 0,
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
    ).mockImplementation(async () => existingBooks[0].id);
    jest.spyOn(
      bookRepository, 'findByISBN',
    ).mockImplementation(async () => existingBooks);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementation(async () => library);

    const [result, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: 10, isLoan: false, libraryId: library.id, amount: -10,
      },
    ));

    expect(error).toBeInstanceOf(InvalidDataError);
    expect(result).toBe(null);
  });

  it('should throw NotFoundError when library is not found', async () => {
    const expectedID = 'expected';
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementation(async () => expectedID);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementation(async () => null);

    const [res, error] = await wrapError(
      interactor.registerBook({
        isbn: '123', price: 10, isLoan: false, libraryId: 'notfound', amount: 10,
      }),
    );

    expect(error).toBeInstanceOf(NotFoundError);
    expect(res).toBe(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
