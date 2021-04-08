import { Pool } from 'pg';
import winston from 'winston';
import { wrapError } from 'src/@types';
import BookPresenter from 'src/interface/presenter/bookPresenter';
import BookRepository from 'src/interface/repository/bookRepository';
import BookInteractor from 'src/usecases/interactor/bookInteractor';
import Datastore from 'src/infrastructure/datastore/datastore';
import { UnknownError, InvalidDataError } from 'src/usecases/errors';
import LibraryRepository from 'src/interface/repository/libraryRepository';
import LibraryFactory from 'src/infrastructure/factories/libraryFactory';
import { LocalBookFactory } from 'src/infrastructure/factories';

jest.mock('src/interface/presenter/bookPresenter');
jest.mock('src/interface/repository/bookRepository');
jest.mock('src/infrastructure/datastore/datastore');
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
  const presenter = new BookPresenter();

  it('should return book id when valid data is passed', async () => {
    const expectedID = 'expected';
    const library = LibraryFactory.build();
    jest.spyOn(
      bookRepository, 'registerBook',
    ).mockImplementation(async () => expectedID);
    jest.spyOn(
      libraryRepository, 'findOneByID',
    ).mockImplementation(async () => library);

    const interactor = new BookInteractor(
      bookRepository, presenter, libraryRepository, logger,
    );

    const [res, error] = await wrapError(
      interactor.registerBook({
        isbn: '123', price: 10, isLoan: false, libraryId: library.id,
      }),
    );

    expect(error).toBe(null);
    expect(res).toBe(expectedID);
  });

  it('should throw InvalidDataError with negative price', async () => {
    const interactor = new BookInteractor(bookRepository, presenter, libraryRepository, logger);
    const [res, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: -10, isLoan: false, libraryId: 'id_library',
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

    const interactor = new BookInteractor(bookRepository, presenter, libraryRepository, logger);
    const [result, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: 10, isLoan: false, libraryId: library.id,
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

    const interactor = new BookInteractor(bookRepository, presenter, libraryRepository, logger);
    const [result, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: 10, isLoan: false, libraryId: library.id,
      },
    ));

    expect(error).toBe(null);
    expect(result).toBe(existingBooks[0].id);
  });

  it('should save the movement of the existing book and return the id of the existing local book', async () => {
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

    const interactor = new BookInteractor(bookRepository, presenter, libraryRepository, logger);
    const [result, error] = await wrapError(interactor.registerBook(
      {
        isbn: '123', price: 10, isLoan: false, libraryId: library.id,
      },
    ));

    expect(error).toBe(null);
    expect(result).toBe(existingBooks[0].id);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
