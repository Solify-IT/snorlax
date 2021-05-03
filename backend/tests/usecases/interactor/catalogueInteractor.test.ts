import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import { CatalogueFactory } from 'src/infrastructure/factories';
import { CatalogueRepository } from 'src/interface/repository';
import { InvalidDataError } from 'src/usecases/errors';
import { CatalogueInteractor } from 'src/usecases/interactor';
import winston from 'winston';

jest.mock('src/interface/repository/catalogueRepository');
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

const validCatalogue = CatalogueFactory.build();
const logger = winston.createLogger();
const datastore = new Datastore(new Pool(), logger);

const catalogueRepository = new CatalogueRepository(datastore);

const interactor = new CatalogueInteractor(catalogueRepository, logger);

describe('findByISBNOrNull', () => {
  it('should return a catalogue when found on db one with same isbn', async () => {
    expect.assertions(4);
    const findByISBNOrNullFn = jest.fn(async () => validCatalogue);
    jest.spyOn(
      catalogueRepository, 'findByISBNOrNull',
    ).mockImplementationOnce(findByISBNOrNullFn);

    const [res, error] = await wrapError(
      interactor.findByISBNOrNull(validCatalogue.isbn),
    );

    expect(findByISBNOrNullFn).toBeCalledTimes(1);
    expect(error).toBeNull();
    expect(res).not.toBeNull();
    expect(res!.isbn).toBe(validCatalogue.isbn);
  });

  it('should throw error when repository throws error', async () => {
    expect.assertions(3);
    const ERROR_MESSAGE = 'error message';
    const findByISBNOrNullFn = jest.fn(async () => { throw new Error(ERROR_MESSAGE); });
    jest.spyOn(
      catalogueRepository, 'findByISBNOrNull',
    ).mockImplementationOnce(findByISBNOrNullFn);

    const [res, error] = await wrapError(
      interactor.findByISBNOrNull(validCatalogue.isbn),
    );

    expect(error).not.toBeNull();
    expect(error!.message).toBe(ERROR_MESSAGE);
    expect(res).toBeNull();
  });
});

describe('registerCatalogue', () => {
  it('should save the catalogue if data is valid', async () => {
    expect.assertions(4);
    const registerCatalogueFn = jest.fn(async () => validCatalogue.id);
    jest.spyOn(
      catalogueRepository, 'registerCatalogue',
    ).mockImplementationOnce(registerCatalogueFn);

    const [res, error] = await wrapError(
      interactor.registerCatalogue(validCatalogue),
    );

    expect(registerCatalogueFn).toBeCalledTimes(1);
    expect(error).toBeNull();
    expect(res).not.toBeNull();
    expect(res!.isbn).toBe(validCatalogue.isbn);
  });

  it('should throw InvalidDataError when negative pages are passed', async () => {
    expect.assertions(3);

    const [res, error] = await wrapError(
      interactor.registerCatalogue({
        ...validCatalogue,
        pages: -10,
      }),
    );

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(InvalidDataError);
    expect(res).toBeNull();
  });

  it('should throw InvalidDataError when no title is passed', async () => {
    expect.assertions(3);

    const [res, error] = await wrapError(
      interactor.registerCatalogue({
        ...validCatalogue,
        title: '',
      }),
    );

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(InvalidDataError);
    expect(res).toBeNull();
  });

  it('should throw InvalidDataError when no author is passed', async () => {
    expect.assertions(3);

    const [res, error] = await wrapError(
      interactor.registerCatalogue({
        ...validCatalogue,
        author: '',
      }),
    );

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(InvalidDataError);
    expect(res).toBeNull();
  });

  it('should throw InvalidDataError when no isbn is passed', async () => {
    expect.assertions(3);

    const [res, error] = await wrapError(
      interactor.registerCatalogue({
        ...validCatalogue,
        isbn: '',
      }),
    );

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(InvalidDataError);
    expect(res).toBeNull();
  });

  it('should throw error when repository throws error', async () => {
    expect.assertions(3);
    const ERROR_MESSAGE = 'error message';
    const registerCatalogueFn = jest.fn(async () => { throw new Error(ERROR_MESSAGE); });
    jest.spyOn(
      catalogueRepository, 'registerCatalogue',
    ).mockImplementationOnce(registerCatalogueFn);

    const [res, error] = await wrapError(
      interactor.registerCatalogue(validCatalogue),
    );

    expect(error).not.toBeNull();
    expect(error!.message).toBe(ERROR_MESSAGE);
    expect(res).toBeNull();
  });
});
