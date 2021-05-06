import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import { CatalogueFactory, givenACatalogueItem } from 'src/infrastructure/factories';
import { CatalogueRepository } from 'src/interface/repository';
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

const datastore = new Datastore(pool, winston.createLogger());
const repository = new CatalogueRepository(datastore);

describe('findByISBNOrNull', () => {
  it('should return an Id if found by isbn', async () => {
    expect.assertions(2);

    const [catalogue] = await givenACatalogueItem(datastore, CatalogueFactory.buildList(3));

    const [res, err] = await wrapError(repository.findByISBNOrNull(catalogue.isbn));

    expect(err).toBeNull();
    expect(res!.id).toBe(catalogue.id);
  });

  it('should return null if item not found in DB', async () => {
    expect.assertions(2);

    await givenACatalogueItem(datastore, CatalogueFactory.buildList(3));

    const [res, err] = await wrapError(repository.findByISBNOrNull('not-found-isbn'));

    expect(err).toBeNull();
    expect(res).toBeNull();
  });
});
