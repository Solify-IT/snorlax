import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import { LIBRARY_TABLE_NAME } from 'src/domain/model';
import Datastore from 'src/infrastructure/datastore/datastore';
import { LocalBookFactory } from 'src/infrastructure/factories';
import { givenALocalBook } from 'src/infrastructure/factories/bookFactory';
import LibraryFactory, { givenALibrary } from 'src/infrastructure/factories/libraryFactory';
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
  const repository = new BookRepository(datastore);

  it('should save the book with valid data', async () => {
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

describe('findByISBN', () => {
  const pgPool = new Pool({
    user: process.env.PGUSER,
  });
  const logger = winston.createLogger();
  const datastore = new Datastore(pgPool, logger);
  const repository = new BookRepository(datastore);

  it('should return an empty list when no local books found', async () => {
    const [result, error] = await wrapError(repository.findByISBN('nothing'));

    expect(error).toBe(null);
    expect(result).toHaveLength(0);
  });

  it('should return a list with local books when found local books', async () => {
    const libraries = await givenALibrary(datastore, LibraryFactory.buildList(3));

    if (!Array.isArray(libraries)) {
      throw new Error();
    }

    const book1 = await givenALocalBook(
      datastore, libraries[1], LocalBookFactory.build({ isbn: 'found' }),
    );
    const book2 = await givenALocalBook(
      datastore, libraries[2], LocalBookFactory.build({ isbn: 'found' }),
    );
    const book3 = await givenALocalBook(
      datastore, libraries[3], LocalBookFactory.build({ isbn: 'found' }),
    );

    const [results, error] = await wrapError(repository.findByISBN('found'));

    expect(error).toBe(null);
    expect(results).toHaveLength(3);
    results?.forEach((result) => {
      expect([book1.id, book2.id, book3.id]).toContain(result.id);
    });
  });
});