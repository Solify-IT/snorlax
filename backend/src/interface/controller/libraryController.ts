import { wrapError } from 'src/@types';
import LibraryInteractor from 'src/usecases/interactor/libraryInteractor';
import { IContext } from './context';

export default class LibraryController {
  userInteractor: LibraryInteractor;

  constructor(userInteractor: LibraryInteractor) {
    this.userInteractor = userInteractor;
  }

  // GET /libraries
  async listAll(context: IContext): Promise<void> {
    const [libraries, error] = await wrapError(
      this.userInteractor.listAll(),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ libraries });
  }
}
