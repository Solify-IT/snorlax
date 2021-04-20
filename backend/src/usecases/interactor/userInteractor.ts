import { wrapError } from 'src/@types';
import User, { UserInput } from 'src/domain/model/user';
import { InvalidDataError } from '../errors';
import IFirebaseApp from '../interfaces/firebase';
import { ILogger } from '../interfaces/logger';
import IUserRepository from '../repository/userRepository';

export default class UserInteractor {
  private userRepository: IUserRepository;

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

    const result = await this.userRepository.createUser({ ...userData, id: fbResult.uid });

    return result;
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
