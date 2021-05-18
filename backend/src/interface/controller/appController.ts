import { ILogger } from 'src/usecases/interfaces/logger';
import BookController from './bookController';
import UserController from './userController';
import LibraryController from './libraryController';
import CatalogueController from './catalogueController';

export interface IAppController {
  books: BookController;
  users: UserController;
  libraries: LibraryController
  catalogue: CatalogueController,
  logger: ILogger,
}

export default IAppController;
