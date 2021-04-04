import { Pool } from 'pg';
import Datastore from 'src/infrastructure/datastore/datastore';
import { LocalBookFactory } from 'src/infrastructure/factories';
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

    const bookData = LocalBookFactory.build();
    // const [res, error] = await wrapError(repository.registerBook(bookData));
    const res = await repository.registerBook(bookData);

    expect(res).not.toBe(null);
  });
});
