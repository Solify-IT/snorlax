import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import { givenALocalBook } from 'src/infrastructure/factories/bookFactory';
import MovementRepository from 'src/interface/repository/movementRepository';
import winston from 'winston';

jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

describe('registerMovement', () => {
  const logger = winston.createLogger();
  const datastore = new Datastore(new Pool(), logger);
  const repository = new MovementRepository(datastore);

  it('should return the id of the new movement when valid data', async () => {
    const localBook = await givenALocalBook(datastore);

    const [result, error] = await wrapError(repository.registerMovement({
      amount: 10, localBookId: localBook.id, isLoan: false,
    }));

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
