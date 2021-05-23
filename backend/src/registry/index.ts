import { credential, initializeApp } from 'firebase-admin';
import IAppController, {
  BookController, CatalogueController, LibraryController, MovementController,
} from 'src/interface/controller';
import UserController from 'src/interface/controller/userController';
import { BookRepository, CatalogueRepository, IDatastore } from 'src/interface/repository';
import LibraryRepository from 'src/interface/repository/libraryRepository';
import MovementRepository from 'src/interface/repository/movementRepository';
import UserRepository from 'src/interface/repository/userRepository';
import BookInteractor from 'src/usecases/interactor/bookInteractor';
import LibraryInteractor from 'src/usecases/interactor/libraryInteractor';
import MovementInteractor from 'src/usecases/interactor/movementInteractor';
import UserInteractor from 'src/usecases/interactor/userInteractor';
import { ILogger } from 'src/usecases/interfaces/logger';
import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } from 'src/utils/settings';
import { CatalogueInteractor } from 'src/usecases/interactor';

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
    const catalogueRepository = new CatalogueRepository(this.datastore);

    const firebase = initializeApp({
      credential: credential.cert({
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
        projectId: FIREBASE_PROJECT_ID,
      }),
    });

    const libraryInteractor = new LibraryInteractor(libraryRepository, this.logger);
    const movementInteractor = new MovementInteractor(movementRepository, this.logger);
    const catalogueInteractor = new CatalogueInteractor(catalogueRepository, this.logger);
    const bookInteractor = new BookInteractor(
      bookRepository,
      libraryInteractor,
      movementInteractor,
      catalogueInteractor,
      this.logger,
    );
    const userInteractor = new UserInteractor(userRepository, firebase, this.logger);

    return {
      books: new BookController(bookInteractor),
      users: new UserController(userInteractor),
      libraries: new LibraryController(libraryInteractor),
      catalogue: new CatalogueController(catalogueInteractor),
      movements: new MovementController(movementInteractor),
    };
  }
}
