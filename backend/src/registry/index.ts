import { GoogleBooksService } from 'src/infrastructure/integrations';
import IAppController, { BookController } from 'src/interface/controller';
import { BookPresenter } from 'src/interface/presenter';
import { BookRepository, IDatastore } from 'src/interface/repository';
import LibraryRepository from 'src/interface/repository/libraryRepository';
import MovementRepository from 'src/interface/repository/movementRepository';
import BookInteractor from 'src/usecases/interactor/bookInteractor';
import LibraryInteractor from 'src/usecases/interactor/libraryInteractor';
import MovementInteractor from 'src/usecases/interactor/movementInteractor';
import { ILogger } from 'src/usecases/interfaces/logger';

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
    const bookPresenter = new BookPresenter();
    const libraryInteractor = new LibraryInteractor(libraryRepository, this.logger);
    const movementInteractor = new MovementInteractor(movementRepository, this.logger);
    const metadataProvider = new GoogleBooksService();
    const bookInteractor = new BookInteractor(
      bookRepository, bookPresenter, libraryInteractor, movementInteractor,
      metadataProvider, this.logger,
    );
    return {
      books: new BookController(bookInteractor),
    };
  }
}
