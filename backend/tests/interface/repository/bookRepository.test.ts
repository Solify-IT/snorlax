import { Pool } from 'pg';
import { LIBRARY_TABLE_NAME } from 'src/domain/model';
import Datastore from 'src/infrastructure/datastore/datastore';
import { LocalBookFactory } from 'src/infrastructure/factories';
import LibraryFactory from 'src/infrastructure/factories/libraryFactory';
import { BookRepository } from 'src/interface/repository';
import winston from 'winston';

jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

describe('registerBook', () => {
  const pgPool = new Pool({
    user: process.env.PGUSER,
  });
  const logger = winston.createLogger();
  const datastore = new Datastore(pgPool, logger);

  it('should save the book with valid data', async () => {
    const repository = new BookRepository(datastore);

    const libraryData = LibraryFactory.build();
    await datastore.insert(LIBRARY_TABLE_NAME, libraryData);
    const bookData = LocalBookFactory.build({
      library: libraryData, libraryId: libraryData.id,
    });
    const res = await repository.registerBook({
      isbn: bookData.isbn,
      libraryId: bookData.libraryId,
      price: bookData.price,
    });

    expect(res).not.toBe(null);
  });

  afterAll(async () => {
    await pgPool.end();
  });
});
