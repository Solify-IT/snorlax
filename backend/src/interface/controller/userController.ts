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
}
