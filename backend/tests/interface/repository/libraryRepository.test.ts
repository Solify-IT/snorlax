import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import LibraryFactory, { givenALibrary } from 'src/infrastructure/factories/libraryFactory';
import { LibraryRepository } from 'src/interface/repository';
import winston from 'winston';

jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

const logger = winston.createLogger();
const pool = new Pool({ min: 1, max: 1 });
const datastore = new Datastore(pool, logger);
const repository = new LibraryRepository(datastore);

beforeEach(async () => pool.query('START TRANSACTION'));
afterEach(async () => pool.query('ROLLBACK'));

describe('findOneByID', () => {
  beforeEach(async () => pool.query('START TRANSACTION'));
  afterEach(async () => pool.query('ROLLBACK'));

  it('should return the id of the new movement when valid data', async () => {
    expect.assertions(3);
    const [library] = await givenALibrary(datastore);

    const { id } = library;

    const [result, error] = await wrapError(repository.findOneByID(id));

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(result?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});

describe('listAll', () => {
  it('should return all the libraries in the database', async () => {
    expect.assertions(3);
    const LIBRARIES_LENGTH = 5;
    await givenALibrary(
      datastore, LibraryFactory.buildList(LIBRARIES_LENGTH),
    );

    const [result, error] = await wrapError(repository.listAll());

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(result).toHaveLength(LIBRARIES_LENGTH);
  });
});
