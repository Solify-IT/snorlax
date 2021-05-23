import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import { LIBRARY_TABLE_NAME } from 'src/domain/model';
import Datastore from 'src/infrastructure/datastore/datastore';
import { CatalogueFactory, givenACatalogueItem, LocalBookFactory } from 'src/infrastructure/factories';
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

const pool = new Pool({ min: 1, max: 1 });

beforeEach(async () => pool.query('START TRANSACTION'));
afterEach(async () => pool.query('ROLLBACK'));

describe('registerBook', () => {
  const logger = winston.createLogger();
  const datastore = new Datastore(pool, logger);
  const repository = new BookRepository(datastore);

  it('should save the book with valid data', async () => {
    expect.assertions(1);
    const libraryData = LibraryFactory.build();
    const bookData = LocalBookFactory.build({
      library: libraryData, libraryId: libraryData.id,
    });
    await Promise.all([
      datastore.insert(LIBRARY_TABLE_NAME, libraryData),
      givenACatalogueItem(datastore, CatalogueFactory.build({ isbn: bookData.isbn })),
    ]);
    const res = await repository.registerBook({
      isbn: bookData.isbn,
      libraryId: bookData.libraryId,
      price: bookData.price,
    });

    expect(res).not.toBe(null);
  });
});

describe('findByISBN', () => {
  const logger = winston.createLogger();
  const datastore = new Datastore(pool, logger);
  const repository = new BookRepository(datastore);

  it('should return an empty list when no local books found', async () => {
    expect.assertions(2);
    const [result, error] = await wrapError(repository.findByISBN('nothing'));

    expect(error).toBe(null);
    expect(result).toHaveLength(0);
  });

  it('should return a list with local books when found local books', async () => {
    expect.assertions(5);
    const FOUND_ISBN = 'found-isbn';
    const libraries = await givenALibrary(datastore, LibraryFactory.buildList(3));
    await givenACatalogueItem(
      datastore, CatalogueFactory.build({ isbn: FOUND_ISBN }),
    );

    if (!Array.isArray(libraries)) {
      throw new Error();
    }

    const book1 = await givenALocalBook(
      datastore, libraries[1], LocalBookFactory.build({ isbn: FOUND_ISBN }),
    );
    const book2 = await givenALocalBook(
      datastore, libraries[2], LocalBookFactory.build({ isbn: FOUND_ISBN }),
    );
    const book3 = await givenALocalBook(
      datastore, libraries[3], LocalBookFactory.build({ isbn: FOUND_ISBN }),
    );

    const [results, error] = await wrapError(repository.findByISBN(FOUND_ISBN));

    expect(error).toBe(null);
    expect(results).toHaveLength(3);
    results?.forEach((result) => {
      expect([book1.id, book2.id, book3.id]).toContain(result.id);
    });
  });
});
