import { Pool } from 'pg';
import { wrapError } from 'src/@types';
import Datastore from 'src/infrastructure/datastore/datastore';
import { givenALibrary } from 'src/infrastructure/factories/libraryFactory';
import UserFactory, { givenARole, givenAUser, RoleFactory } from 'src/infrastructure/factories/userFactory';
import UserRepository from 'src/interface/repository/userRepository';
import { createLogger } from 'winston';

jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

const pool = new Pool({ min: 1, max: 1 });
const logger = createLogger();

const datastore = new Datastore(pool, logger);

const repository = new UserRepository(datastore);

beforeEach(() => pool.query('START TRANSACTION'));
afterEach(() => pool.query('ROLLBACK'));

describe('createUser', () => {
  it('should save the user when valid data is passed', async () => {
    expect.assertions(3);
    const [library] = await givenALibrary(datastore);
    const [role] = await givenARole(datastore);

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
    expect.assertions(2);
    const [library] = await givenALibrary(datastore);

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
    expect.assertions(2);
    const [role] = await givenARole(datastore);

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

describe('listAllRoles', () => {
  it('should return all the roles from the database', async () => {
    expect.assertions(3);
    const LIBRARIES_LENGTH = 5;
    await givenARole(
      datastore, RoleFactory.buildList(LIBRARIES_LENGTH),
    );

    const [result, error] = await wrapError(repository.listAllRoles());

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(result).toHaveLength(LIBRARIES_LENGTH);
  });
});

describe('listUsers', () => {
  it('should return all the users from the database', async () => {
    expect.assertions(3);
    const USERS_LENGTH = 5;
    const [role] = await givenARole(datastore);
    const [library] = await givenALibrary(datastore);
    const usersMocked = UserFactory.buildList(
      USERS_LENGTH, { roleId: role.id, libraryId: library.id },
    );
    await givenAUser(
      datastore, usersMocked,
    );

    const [result, error] = await wrapError(repository.listUsers());

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(result).toHaveLength(USERS_LENGTH);
  });
});
