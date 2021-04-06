import IAppController, { BookController } from 'src/interface/controller';
import { BookPresenter } from 'src/interface/presenter';
import { BookRepository, IDatastore } from 'src/interface/repository';
import LibraryRepository from 'src/interface/repository/libraryRepository';
import BookInteractor from 'src/usecases/interactor/bookInteractor';
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
    const bookPresenter = new BookPresenter();
    const bookInteractor = new BookInteractor(
      bookRepository, bookPresenter, libraryRepository, this.logger,
    );
    return {
      books: new BookController(bookInteractor),
    };
  }
}
