import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import { Library, LIBRARY_TABLE_NAME } from 'src/domain/model';
import Datastore from 'src/infrastructure/datastore/datastore';
import LibraryFactory from 'src/infrastructure/factories/libraryFactory';
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
