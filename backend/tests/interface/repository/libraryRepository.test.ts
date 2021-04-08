import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import { givenALibrary } from 'src/infrastructure/factories/libraryFactory';
import { LibraryRepository } from 'src/interface/repository';
import winston from 'winston';

jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

describe('findOneByID', () => {
  const logger = winston.createLogger();
  const datastore = new Datastore(new Pool(), logger);
  const repository = new LibraryRepository(datastore);

  it('should return the id of the new movement when valid data', async () => {
    const { id } = await givenALibrary(datastore);

    const [result, error] = await wrapError(repository.findOneByID(id));

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(result?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
