import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import { BOOK_TABLE_NAME } from 'src/domain/model';
import Datastore from 'src/infrastructure/datastore/datastore';
import { LocalBookFactory } from 'src/infrastructure/factories';
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

    const values = LocalBookFactory.build();

    const [result, error] = await wrapError(
      datastore.insert(BOOK_TABLE_NAME, values),
    );

    expect(error).toBe(null);
    expect(result).toBe(values.id);
  });
});
