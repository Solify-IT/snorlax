import { wrapError } from 'src/@types';
import { LibraryInput } from 'src/domain/model/library';
import LibraryInteractor from 'src/usecases/interactor/libraryInteractor';
import { IContext } from './context';

export default class LibraryController {
  libraryInteractor: LibraryInteractor;

  constructor(libraryInteractor: LibraryInteractor) {
    this.libraryInteractor = libraryInteractor;
  }

  // GET /libraries
  async listAll(context: IContext): Promise<void> {
    const [libraries, error] = await wrapError(
      this.libraryInteractor.listAll(),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ libraries });
  }

  // PUT /libraries{ libraryData }
  async updateLibrary(context: IContext): Promise<void> {
    const {
      email,
      name,
      phoneNumber,
      state,
      city,
      address,
      inCharge,
    } = context.request.body;

    const libraryData: LibraryInput = {
      email,
      name,
      phoneNumber,
      state,
      city,
      address,
      inCharge,
    };

    const [id, error] = await wrapError(
      this.libraryInteractor.updateLibrary(libraryData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ id });
  }

  async getLibrary(context: IContext): Promise<void> {
    const {
      id,
    } = context.request.query;
    const [users, error] = await wrapError(
      this.libraryInteractor.getLibrary(
        id as string,
      ),
    );

    if (error) {
      context.next(error);
      return;
    }
    context.response.status(200).json({ users });
  }

  // POST /libraries { libraryData }
  async createLibrary(context: IContext): Promise<void> {
    const {
      email,
      name,
      phoneNumber,
      state,
      city,
      address,
      inCharge,
    } = context.request.body;

    const libraryData: LibraryInput = {
      email,
      name,
      phoneNumber,
      state,
      city,
      address,
      inCharge,
    };

    const [id, error] = await wrapError(
      this.libraryInteractor.createLibrary(libraryData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ id });
  }
}
