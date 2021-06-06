import { wrapError } from 'src/@types';
import MovementInteractor from 'src/usecases/interactor/movementInteractor';
import { MovementInputData } from 'src/domain/model/movement';
import { IContext } from './context';

export default class BookController {
  movementInteractor: MovementInteractor;

  constructor(movementInteractor: MovementInteractor) {
    this.movementInteractor = movementInteractor;
  }

  async getTodaySale(context: IContext): Promise<void> {
    const {
      date,
    } = context.request.query;

    const [sale, error] = await wrapError(
      this.movementInteractor.getTodaySale(date),
    );

    if (error) {
      context.next(error);
      return;
    }
    context.response.status(200).json({ sale });
  }

  async seeMovements(context: IContext): Promise<void> {
    const [movements, error] = await wrapError(
      this.movementInteractor.listAllmovements(),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ movements });
  }

  async registerMovement(context: IContext): Promise<void> {
    const {
      localBookId,
      amount,
      isLoan,
      type,
    } = context.request.body;

    const movementData: MovementInputData = {
      localBookId,
      amount,
      isLoan,
      type,
    };
    const [id, error] = await wrapError(
      this.movementInteractor.registerMovement(movementData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ id });
  }
}
