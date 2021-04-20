import { credential, initializeApp } from 'firebase-admin';
import IAppController, { BookController } from 'src/interface/controller';
import UserController from 'src/interface/controller/userController';
import { GoogleBooksService } from 'src/infrastructure/integrations';
import { BookRepository, IDatastore } from 'src/interface/repository';
import LibraryRepository from 'src/interface/repository/libraryRepository';
import MovementRepository from 'src/interface/repository/movementRepository';
import UserRepository from 'src/interface/repository/userRepository';
import BookInteractor from 'src/usecases/interactor/bookInteractor';
import LibraryInteractor from 'src/usecases/interactor/libraryInteractor';
import MovementInteractor from 'src/usecases/interactor/movementInteractor';
import UserInteractor from 'src/usecases/interactor/userInteractor';
import { ILogger } from 'src/usecases/interfaces/logger';
import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } from 'src/utils/settings';

export default class Registry {
  datastore: IDatastore;

  logger: ILogger;

  constructor(datastore: IDatastore, logger: ILogger) {
    this.datastore = datastore;
    this.logger = logger;
  }

  newAppController(): IAppController {
    const bookRepository = new BookRepository(this.datastore);
    const libraryRepository = new LibraryRepository(this.datastore);
    const movementRepository = new MovementRepository(this.datastore);
    const userRepository = new UserRepository(this.datastore);

    const metadataProvider = new GoogleBooksService();
    const firebase = initializeApp({
      credential: credential.cert({
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
        projectId: FIREBASE_PROJECT_ID,
      }),
    });

    const libraryInteractor = new LibraryInteractor(libraryRepository, this.logger);
    const movementInteractor = new MovementInteractor(movementRepository, this.logger);
    const bookInteractor = new BookInteractor(
      bookRepository,
      libraryInteractor,
      movementInteractor,
      metadataProvider,
      this.logger,
    );
    const userInteractor = new UserInteractor(userRepository, firebase, this.logger);

    return {
      books: new BookController(bookInteractor),
      users: new UserController(userInteractor),
    };
  }
}
