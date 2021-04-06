import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import { BOOK_TABLE_NAME, LIBRARY_TABLE_NAME, LocalBookInput } from 'src/domain/model';
import Datastore from 'src/infrastructure/datastore/datastore';
import { LocalBookFactory } from 'src/infrastructure/factories';
import LibraryFactory from 'src/infrastructure/factories/libraryFactory';
import winston from 'winston';

describe('insert', () => {
  const errorLoggerFn = jest.fn();
  jest.mock('winston', () => ({
    createLogger: () => ({
      error: errorLoggerFn,
      info: jest.fn(),
    }),
  }));

  it('should return the saved object when valid data', async () => {
    const logger = winston.createLogger();
    const datastore = new Datastore(new Pool(), logger);

    const library = LibraryFactory.build();
    await datastore.insert(LIBRARY_TABLE_NAME, library);
    const values = LocalBookFactory.build({ library, libraryId: library.id });

    const [result, error] = await wrapError(
      datastore.insert<LocalBookInput>(BOOK_TABLE_NAME, {
        id: values.id,
        isbn: values.isbn,
        libraryId: values.libraryId,
        price: values.price,
      }),
    );

    expect(error).toBe(null);
    expect(result).toBe(values.id);
  });
});
