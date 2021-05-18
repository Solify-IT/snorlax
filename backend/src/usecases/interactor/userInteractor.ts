import { wrapError } from 'src/@types';
import User, { StoredRole, StoredUser, UserInput } from 'src/domain/model/user';
import { v4 as uuidv4 } from 'uuid';
import { InvalidDataError, UnauthorizedError } from '../errors';
import IFirebaseApp from '../interfaces/firebase';
import { ILogger } from '../interfaces/logger';
import IUserRepository from '../repository/userRepository';

export default class UserInteractor {
  public userRepository: IUserRepository;

  private firebase: IFirebaseApp;

  private logger: ILogger;

  constructor(userRepository: IUserRepository, firebase: IFirebaseApp, logger: ILogger) {
    this.userRepository = userRepository;
    this.firebase = firebase;
    this.logger = logger;
  }

  async createUser(userData: UserInput): Promise<User['id']> {
    this.logger.info('Creating new user.', { logger: 'UserInteractor:createUser' });

    this.validateUserData(userData);

    const [fbResult, fbError] = await wrapError(
      this.firebase.auth().createUser({ ...userData }),
    );

    if (fbError || !fbResult) {
      const message = 'Error while creating user in Firebase!';
      this.logger.error(message, {
        userData, logger: 'UserInteractor:createUser', fbError,
      });
      throw new Error(message);
    }

    const result = await this.userRepository.createUser({
      roleId: userData.roleId,
      libraryId: userData.libraryId,
      disabled: userData.disabled,
      displayName: userData.displayName,
      email: userData.email,
      id: uuidv4(),
    });

    return result;
  }

  async updateUser(userData: UserInput): Promise<StoredUser> {
    this.logger.info('Updating user.', { logger: 'UserInteractor:updateUser' });

    this.validateUserData(userData);

    const result = await this.userRepository.updateUser({
      roleId: userData.roleId,
      libraryId: userData.libraryId,
      disabled: userData.disabled,
      displayName: userData.displayName,
      email: userData.email,
      id: uuidv4(),
    });

    return result;
  }

  async listAllRoles(): Promise<StoredRole[]> {
    return this.userRepository.listAllRoles();
  }

  async listUsers(): Promise<StoredUser[]> {
    return this.userRepository.listUsers();
  }

  async getUser(id: string): Promise<StoredUser[]> {
    return this.userRepository.getUser(id);
  }

  async signIn(token: string): Promise<string> {
    const decoded = await this.firebase.auth().verifyIdToken(token);

    if (!decoded.email) {
      const message = 'User not found in firebase!';
      this.logger.error({ message }); // { message } === { message: message }
      throw new UnauthorizedError(message);
    }

    const user = await this.userRepository.findOneOrNullByEmail(decoded.email);

    if (!user) {
      const message = 'User not found in our database!';
      this.logger.error({ message });
      throw new UnauthorizedError(message);
    }

    const newToken = await this.firebase.auth().createCustomToken(decoded.uid, {
      libraryId: user.libraryId,
      roleId: user.roleId,
      id: user.id,
      library: user.library,
      role: user.role,
    });

    return newToken;
  }

  private validateUserData(userData: UserInput) {
    let message = '';

    if (!userData.email || !userData.displayName || !userData.password) {
      message += 'Missing data! ';
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(userData.email)) {
      message += 'The email is not valid. ';
    }

    const paswdRegex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

    if (!paswdRegex.test(userData.password)) {
      message += 'Your password is weak! ';
    }

    if (message !== '') {
      this.logger.error(message, {
        userData, logger: 'UserInteractor:validateUserData',
      });
      throw new InvalidDataError(message);
    }
  }
}
