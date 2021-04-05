import { Pool } from 'pg';
import winston from 'winston';
import { wrapError } from 'src/@types';
import BookPresenter from 'src/interface/presenter/bookPresenter';
import BookRepository from 'src/interface/repository/bookRepository';
import BookInteractor from 'src/usecases/interactor/bookInteractor';
import Datastore from 'src/infrastructure/datastore/datastore';
import { UnknownError, InvalidDataError } from 'src/usecases/errors';

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
  const repository = new BookRepository(new Datastore(new Pool(), logger));
  const presenter = new BookPresenter();

  it('should return book id when valid data is passed', async () => {
    const expectedID = 'expected';
    const spy = jest.spyOn(
      repository, 'registerBook',
    ).mockImplementation(async () => expectedID);

    const interactor = new BookInteractor(repository, presenter, logger);

    const [res, error] = await wrapError(
      interactor.registerBook({ isbn: '123', price: 10, isLoan: false }),
    );

    expect(error).toBe(null);
    expect(res).toBe(expectedID);
    spy.mockRestore();
  });

  it('should throw InvalidDataError with negative price', async () => {
    const interactor = new BookInteractor(repository, presenter, logger);
    const [res, error] = await wrapError(interactor.registerBook(
      { isbn: '123', price: -10, isLoan: false },
    ));

    expect(error).toBeInstanceOf(InvalidDataError);
    expect(res).toBe(null);
  });

  it('should throw UnknownError when no result got from interactor', async () => {
    const spy = jest.spyOn(
      repository, 'registerBook',
    ).mockImplementation(async () => { throw new UnknownError('unknown'); });

    const interactor = new BookInteractor(repository, presenter, logger);
    const [result, error] = await wrapError(interactor.registerBook(
      { isbn: '123', price: 10, isLoan: false },
    ));

    expect(error).toBeInstanceOf(UnknownError);
    expect(result).toBe(null);
    spy.mockReset();
  });
});
