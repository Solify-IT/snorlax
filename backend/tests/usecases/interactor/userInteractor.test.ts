import winston from 'winston';
import { Pool } from 'pg';
import { initializeApp } from 'firebase-admin';
import Datastore from 'src/infrastructure/datastore/datastore';
import UserRepository from 'src/interface/repository/userRepository';
import UserInteractor from 'src/usecases/interactor/userInteractor';
import { wrapError } from 'src/@types';
import UserFactory from 'src/infrastructure/factories/userFactory';
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

describe('createUser', () => {
  const logger = winston.createLogger();
  const firebase = initializeApp() as unknown as jest.Mocked<IFirebaseApp>;

  const userRepository = new UserRepository(new Datastore(new Pool(), logger));

  const interactor = new UserInteractor(userRepository, firebase, logger);

  it('should return the new user when valid data is received', async () => {
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
    const repoCreateUser = jest.fn(async () => ({
      ...mockUser,
    }));

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
    expect(repoCreateUser).toBeCalledWith({
      ...userData, id: mockUser.id,
    });
    expect(result!.id).toBe(mockUser.id);
  });

  it('should throw error when invalid email is passed', async () => {
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
