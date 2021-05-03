import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import { Library, LIBRARY_TABLE_NAME } from 'src/domain/model';
import Datastore from 'src/infrastructure/datastore/datastore';
import LibraryFactory, { givenALibrary } from 'src/infrastructure/factories/libraryFactory';
import NotFoundError from 'src/usecases/errors/notFoundError';
import winston from 'winston';

const errorLoggerFn = jest.fn();
jest.mock('winston', () => ({
  createLogger: () => ({
    error: errorLoggerFn,
    info: jest.fn(),
  }),
}));

const logger = winston.createLogger();
const pool = new Pool();
const datastore = new Datastore(pool, logger);

beforeEach(async () => pool.query('START TRANSACTION'));
afterEach(async () => pool.query('ROLLBACK'));

describe('insert', () => {
  it('should return the saved object when valid data', async () => {
    const library = LibraryFactory.build();

    const [result, error] = await wrapError(
      datastore.insert<Library>(LIBRARY_TABLE_NAME, {
        id: library.id,
        address: library.address,
        city: library.city,
        email: library.email,
        inCharge: library.inCharge,
        name: library.name,
        phoneNumber: library.phoneNumber,
        state: library.state,
      }),
    );

    expect(error).toBe(null);
    expect(result).toBe(library.id);
  });
});

describe('get', () => {
  it('should return the found object when existing', async () => {
    const LIBRARIES_LENGTH = 3;
    await givenALibrary(
      datastore, LibraryFactory.buildList(LIBRARIES_LENGTH),
    );

    const [result, error] = await wrapError(datastore.get(
      `SELECT * FROM ${LIBRARY_TABLE_NAME}`,
    ));

    expect(error).toBe(null);
    expect(result!.length).toBe(LIBRARIES_LENGTH);
  });

  it('should return an empty array when not found anything', async () => {
    await givenALibrary(
      datastore, LibraryFactory.buildList(3, { name: 'Testito' }),
    );

    const [result, error] = await wrapError(datastore.get(
      `SELECT * FROM ${LIBRARY_TABLE_NAME} WHERE name = 'Testote'`,
    ));

    expect(error).toBe(null);
    expect(result!.length).toBe(0);
  });
});

describe('getById', () => {
  it('should return the found object when existing', async () => {
    const LIBRARIES_LENGTH = 3;
    const [library] = await givenALibrary(
      datastore, LibraryFactory.buildList(LIBRARIES_LENGTH),
    );

    const [result, error] = await wrapError(
      datastore.getById<Library>(LIBRARY_TABLE_NAME, library.id),
    );

    expect(error).toBe(null);
    expect(result!.id).toBe(library.id);
  });

  it('should throw an error when not found', async () => {
    await givenALibrary(
      datastore, LibraryFactory.buildList(3, { name: 'Testito' }),
    );

    const [result, error] = await wrapError(
      datastore.getById(LIBRARY_TABLE_NAME, LibraryFactory.build().id),
    );

    expect(error).not.toBe(null);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(result).toBeNull();
  });
});
