import winston from 'winston';
import { Pool } from 'pg';
import { initializeApp } from 'firebase-admin';
import Datastore from 'src/infrastructure/datastore/datastore';
import UserRepository from 'src/interface/repository/userRepository';
import UserInteractor from 'src/usecases/interactor/userInteractor';
import { wrapError } from 'src/@types';
import UserFactory, { RoleFactory } from 'src/infrastructure/factories/userFactory';
import IFirebaseApp from 'src/usecases/interfaces/firebase';
import { InvalidDataError } from 'src/usecases/errors';

jest.mock('src/infrastructure/datastore/datastore');
jest.mock('src/interface/repository/userRepository');
jest.mock('winston', () => ({
  createLogger: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});
jest.mock('firebase-admin', () => ({
  initializeApp: () => ({
    auth: jest.fn(),
  }),
}));

const logger = winston.createLogger();
const firebase = initializeApp() as unknown as jest.Mocked<IFirebaseApp>;

const userRepository = new UserRepository(new Datastore(new Pool(), logger));

const interactor = new UserInteractor(userRepository, firebase, logger);

describe('createUser', () => {
  it('should return the new user when valid data is received', async () => {
    expect.assertions(4);
    const createUserMedatadaMock = {
      metadata: {
        lastSignInTime: '',
        creationTime: '',
        toJSON: jest.fn(),
      },
      providerData: [],
      toJSON: jest.fn(),
    };
    const mockUser = UserFactory.build();
    const repoCreateUser = jest.fn(async () => mockUser.id);

    firebase.auth.mockImplementation(jest.fn(() => ({
      createUser: async () => ({
        uid: mockUser.id,
        disabled: mockUser.disabled,
        email: mockUser.email,
        emailVerified: false,
        ...createUserMedatadaMock,
      }),
    })));
    jest.spyOn(userRepository, 'createUser').mockImplementation(repoCreateUser);

    const userData = {
      email: mockUser.email,
      password: '1mellon#IHateTheOneRing',
      displayName: mockUser.displayName,
      disabled: mockUser.disabled,
      roleId: mockUser.role.id,
      libraryId: mockUser.library.id,
    };

    const [result, error] = await wrapError(interactor.createUser(userData));

    expect(error).toBe(null);
    expect(result).not.toBe(null);
    expect(firebase.auth).toBeCalled();
    expect(result).toBe(mockUser.id);
  });

  it('should throw error when invalid email is passed', async () => {
    expect.assertions(3);
    const [res, err] = await wrapError(interactor.createUser({
      disabled: false,
      displayName: 'Gandalf',
      email: 'gandalf.com',
      libraryId: 'anId',
      password: '1mellon#IHateTheOneRing',
      roleId: 'roleId',
    }));

    expect(err).not.toBe(null);
    expect(res).toBe(null);
    expect(err).toBeInstanceOf(InvalidDataError);
  });

  it('should throw error when no password is passed', async () => {
    expect.assertions(3);
    const [res, err] = await wrapError(interactor.createUser({
      disabled: false,
      displayName: 'Gandalf',
      email: 'gandalf@arda.com',
      libraryId: 'anId',
      password: '',
      roleId: 'roleId',
    }));

    expect(err).not.toBe(null);
    expect(res).toBe(null);
    expect(err).toBeInstanceOf(InvalidDataError);
  });

  it('should throw error when invalud password is passed', async () => {
    expect.assertions(3);
    const [res, err] = await wrapError(interactor.createUser({
      disabled: false,
      displayName: 'Gandalf',
      email: 'gandalf@arda.com',
      libraryId: 'anId',
      password: '1',
      roleId: 'roleId',
    }));

    expect(err).not.toBe(null);
    expect(res).toBe(null);
    expect(err).toBeInstanceOf(InvalidDataError);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('listAllRoles', () => {
  it('should return the list of all the roles', async () => {
    expect.assertions(2);
    const ROLES_LENGTH = 5;
    const roles = RoleFactory.buildList(ROLES_LENGTH);

    jest.spyOn(userRepository, 'listAllRoles').mockImplementation(async () => roles);

    const [res, error] = await wrapError(interactor.listAllRoles());

    expect(error).toBe(null);
    expect(res).toHaveLength(ROLES_LENGTH);
  });

  it('should throw error when error is received from repository', async () => {
    expect.assertions(2);
    jest.spyOn(userRepository, 'listAllRoles').mockImplementation(async () => {
      throw new Error('');
    });

    const [res, error] = await wrapError(interactor.listAllRoles());

    expect(error).toBeInstanceOf(Error);
    expect(res).toBe(null);
  });
});

// GIVEN - WHEN - THEN
describe('listUsers', () => {
  it('should list the users', async () => {
    const USERS_LENGTH = 5;

    jest.spyOn(userRepository, 'listUsers').mockImplementation(async () => UserFactory.buildList(USERS_LENGTH));

    const [result, error] = await wrapError(interactor.listUsers());

    expect(error).toBe(null);
    expect(result).toHaveLength(USERS_LENGTH);
  });

  it('should throw error when repository throws error', async () => {
    const ERROR_MESSAGE = 'Disconected from DB.';

    jest.spyOn(userRepository, 'listUsers').mockImplementation(async () => { throw new Error(ERROR_MESSAGE); });

    const [result, error] = await wrapError(interactor.listUsers());

    expect(error).not.toBe(null);
    expect(error!.message).toBe(ERROR_MESSAGE);
    expect(result).toBe(null);
  });
});
