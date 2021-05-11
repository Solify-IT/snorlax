import BookController from './bookController';
import UserController from './userController';
import LibraryController from './libraryController';
import CatalogueController from './catalogueController';
import MovementController from './movementController';

export interface IAppController {
  books: BookController;
  users: UserController;
  libraries: LibraryController
  catalogue: CatalogueController,
  movements: MovementController,
}

export default IAppController;
