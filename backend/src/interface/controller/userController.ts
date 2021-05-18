import { wrapError } from 'src/@types';
import { UserInput } from 'src/domain/model/user';
import { UnauthorizedError } from 'src/usecases/errors';
import UserInteractor from 'src/usecases/interactor/userInteractor';
import { isAdmin } from '../auth';
import { IContext } from './context';

export default class UserController {
  userInteractor: UserInteractor;

  constructor(userInteractor: UserInteractor) {
    this.userInteractor = userInteractor;
  }

  // POST /users { userData }
  async createUser(context: IContext): Promise<void> {
    if (!isAdmin(context.request.currentUser.role.name)) {
      const MESSAGE = 'Permisos insuficientes.';
      context.logger.error({ message: MESSAGE });
      throw new UnauthorizedError(MESSAGE);
    }

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
    if (!isAdmin(context.request.currentUser.role.name)) {
      const MESSAGE = 'Permisos insuficientes.';
      context.logger.error({ message: MESSAGE });
      throw new UnauthorizedError(MESSAGE);
    }

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
    if (!isAdmin(context.request.currentUser.role.name)) {
      const MESSAGE = 'Permisos insuficientes.';
      context.logger.error({ message: MESSAGE });
      throw new UnauthorizedError(MESSAGE);
    }

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
      return;
    }
    context.response.status(200).json({ users });
  }

  // GET /users/sign-in
  async signIn(context: IContext): Promise<void> {
    const { idToken } = context.request.body;
    const [token, error] = await wrapError(
      this.userInteractor.signIn(idToken as string),
    );

    if (error) {
      context.next(error);
      return;
    }
    context.response.status(200).json({ token });
  }
}
