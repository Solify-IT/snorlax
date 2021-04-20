import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import { givenALibrary } from 'src/infrastructure/factories/libraryFactory';
import UserFactory, { givenARole } from 'src/infrastructure/factories/userFactory';
import UserRepository from 'src/interface/repository/userRepository';
import { createLogger } from 'winston';

jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

describe('createUser', () => {
  const pgPool = new Pool({
    user: process.env.PGUSER,
  });
  const logger = createLogger();

  const datastore = new Datastore(pgPool, logger);

  const repository = new UserRepository(datastore);

  it('should save the user when valid data is passed', async () => {
    const library = await givenALibrary(datastore);
    const role = await givenARole(datastore);

    const mockedUser = UserFactory.build({
      roleId: role.id,
      role,
      library: Array.isArray(library) ? library[0] : library,
      libraryId: Array.isArray(library) ? library[0].id : library.id,
    });

    const [res, err] = await wrapError(repository.createUser({
      disabled: mockedUser.disabled,
      displayName: mockedUser.displayName,
      email: mockedUser.email,
      id: mockedUser.id,
      libraryId: mockedUser.libraryId,
      roleId: mockedUser.roleId,
    }));

    expect(err).toBe(null);
    expect(res).not.toBe(null);
    expect(res).toBe(mockedUser.id);
  });

  it('should not save the user when invalid roleId is passed', async () => {
    const library = await givenALibrary(datastore);

    const mockedUser = UserFactory.build({
      library: Array.isArray(library) ? library[0] : library,
      libraryId: Array.isArray(library) ? library[0].id : library.id,
    });

    const [res, err] = await wrapError(repository.createUser({
      disabled: mockedUser.disabled,
      displayName: mockedUser.displayName,
      email: mockedUser.email,
      id: mockedUser.id,
      roleId: 'this-does-not-exists',
      libraryId: mockedUser.roleId,
    }));

    expect(res).toBe(null);
    expect(err).not.toBe(null);
  });

  it('should not save the user when invalid libraryId is passed', async () => {
    const role = await givenARole(datastore);

    const mockedUser = UserFactory.build({ role, roleId: role.id });

    const [res, err] = await wrapError(repository.createUser({
      disabled: mockedUser.disabled,
      displayName: mockedUser.displayName,
      email: mockedUser.email,
      id: mockedUser.id,
      libraryId: 'this-does-not-exists',
      roleId: mockedUser.roleId,
    }));

    expect(res).toBe(null);
    expect(err).not.toBe(null);
  });
});
