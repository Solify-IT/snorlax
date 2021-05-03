import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import { CatalogueFactory, givenACatalogueItem } from 'src/infrastructure/factories';
import { givenALocalBook, LocalBookFactory } from 'src/infrastructure/factories/bookFactory';
import MovementRepository from 'src/interface/repository/movementRepository';
import winston from 'winston';

jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

const logger = winston.createLogger();
const pool = new Pool();
const datastore = new Datastore(pool, logger);
const repository = new MovementRepository(datastore);

beforeEach(async () => pool.query('START TRANSACTION'));
afterEach(async () => pool.query('ROLLBACK'));

describe('registerMovement', () => {
  it('should return the id of the new movement when valid data', async () => {
    expect.assertions(3);
    const ISBN = 'found-isbn';
    await givenACatalogueItem(datastore, CatalogueFactory.build({ isbn: ISBN }));
    const localBook = await givenALocalBook(
      datastore, undefined, LocalBookFactory.build({ isbn: ISBN }),
    );

    const [result, error] = await wrapError(repository.registerMovement({
      amount: 10, localBookId: localBook.id, isLoan: false,
    }));

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
