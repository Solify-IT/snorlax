import { wrapError } from 'src/@types';
import { UserInput } from 'src/domain/model/user';
import UserInteractor from 'src/usecases/interactor/userInteractor';
import { IContext } from './context';

export default class UserController {
  userInteractor: UserInteractor;

  constructor(userInteractor: UserInteractor) {
    this.userInteractor = userInteractor;
  }

  // POST /users { userData }
  async createUser(context: IContext): Promise<void> {
    const {
      email,
      disabled,
      displayName,
      libraryId,
      password,
      roleId,
    } = context.request.body;

    const userData: UserInput = {
      email,
      disabled: JSON.parse(disabled),
      displayName,
      libraryId,
      password,
      roleId,
    };

    const [id, error] = await wrapError(
      this.userInteractor.createUser(userData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ id });
  }

  // PUT /users { userData }
  async updateUser(context: IContext): Promise<void> {
    const {
      email,
      disabled,
      displayName,
      libraryId,
      password,
      roleId,
    } = context.request.body;

    const userData: UserInput = {
      email,
      disabled: JSON.parse(disabled),
      displayName,
      libraryId,
      password,
      roleId,
    };

    const [id, error] = await wrapError(
      this.userInteractor.updateUser(userData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ id });
  }

  // GET /users/roles
  async listAllRoles(context: IContext): Promise<void> {
    const [roles, error] = await wrapError(
      this.userInteractor.listAllRoles(),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ roles });
  }

  // GET /users
  async listUsers(context: IContext): Promise<void> {
    const [users, error] = await wrapError(
      this.userInteractor.listUsers(),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ users });
  }

  async getUser(context: IContext): Promise<void> {
    const {
      id,
    } = context.request.query;
    const [users, error] = await wrapError(
      this.userInteractor.getUser(
        id as string,
      ),
    );

    if (error) {
      context.next(error);
    }
    context.response.status(200).json({ users });
  }
}
