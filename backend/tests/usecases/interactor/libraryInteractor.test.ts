import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import LibraryFactory from 'src/infrastructure/factories/libraryFactory';
import { LibraryRepository } from 'src/interface/repository';
import { LibraryInteractor } from 'src/usecases/interactor';
import winston from 'winston';

jest.mock('src/interface/repository');
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

describe('listAll', () => {
  const logger = winston.createLogger();

  const repository = new LibraryRepository(new Datastore(new Pool(), logger));

  const interactor = new LibraryInteractor(repository, logger);

  it('should list all the libraries', async () => {
    const LIBRARIES_LENGTH = 5;
    const libraries = LibraryFactory.buildList(LIBRARIES_LENGTH);

    jest.spyOn(repository, 'listAll').mockImplementation(async () => libraries);

    const [res, error] = await wrapError(interactor.listAll());

    expect(error).toBe(null);
    expect(res).toHaveLength(LIBRARIES_LENGTH);
  });

  it('should throw error when error is received from repository', async () => {
    jest.spyOn(repository, 'listAll').mockImplementation(async () => {
      throw new Error('');
    });

    const [res, error] = await wrapError(interactor.listAll());

    expect(error).toBeInstanceOf(Error);
    expect(res).toBe(null);
  });
});
