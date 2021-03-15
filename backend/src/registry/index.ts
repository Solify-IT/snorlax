import IAppController, { BookController } from 'src/interface/controller';
import { BookPresenter } from 'src/interface/presenter';
import { BookRepository, IDatastore } from 'src/interface/repository';
import BookInteractor from 'src/usecases/interactor/bookInteractor';

export default class Registry {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  newAppController(): IAppController {
    const bookRepository = new BookRepository(this.datastore);
    const bookPresenter = new BookPresenter();
    const bookInteractor = new BookInteractor(bookRepository, bookPresenter);
    return {
      books: new BookController(bookInteractor),
    };
  }
}
