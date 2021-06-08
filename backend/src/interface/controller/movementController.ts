import { wrapError } from 'src/@types';
import MovementInteractor from 'src/usecases/interactor/movementInteractor';
import { MovementInputData, ReportInput } from 'src/domain/model/movement';
import { parse } from 'json2csv';
import { v4 as uuidv4 } from 'uuid';
import { IContext } from './context';

const parserFields = ['fecha', 'typ', 'totalCount', 'units', 'total'];
const csvParserFields = { fields: parserFields, quote: '' };

export default class BookController {
  movementInteractor: MovementInteractor;

  constructor(movementInteractor: MovementInteractor) {
    this.movementInteractor = movementInteractor;
  }

  async getTodaySale(context: IContext): Promise<void> {
    const {
      date,
      libraryId,
    } = context.request.query;

    const ts = Number.parseInt(date as string, 10);

    const [sale, error] = await wrapError(
      this.movementInteractor.getTodaySale(ts, libraryId as string),
    );

    if (error) {
      context.next(error);
      return;
    }
    context.response.status(200).json({ sale });
  }

  async seeMovements(context: IContext): Promise<void> {
    const {
      libraryId,
    } = context.request.query;
    const [movements, error] = await wrapError(
      this.movementInteractor.listAllmovements(libraryId as string),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ movements });
  }

  async ReportMovements(context: IContext): Promise<void> {
    const {
      fechaInitial,
      fechaEnd,
      type,
    } = context.request.query;

    const reportData: ReportInput = {
      fechaInitial,
      fechaEnd,
      type,
    };

    const [movements, error] = await wrapError(
      this.movementInteractor.reportMovementsFilter(reportData),
    );

    if (error) {
      context.next(error);
      return;
    }

    context.response.status(200).json({ movements });
  }

  async reportMovementsCSV(context: IContext): Promise<void> {
    const {
      fechaInitial,
      fechaEnd,
      type,
    } = context.request.query;

    const reportData: ReportInput = {
      fechaInitial,
      fechaEnd,
      type,
    };
    try {
      const movements = await this.movementInteractor.reportMovementsFilter(reportData);

      const csv = parse(movements, csvParserFields);
      context.response.header('Content-Type', 'text/csv');
      context.response.attachment(`${uuidv4()}.csv`);
      context.response.status(200).send(csv);
    } catch (err) {
      context.next(err);
    }
  }

  async registerMovement(context: IContext): Promise<void> {
    const {
      localBookId,
      amount,
      isLoan,
      total,
      type,
    } = context.request.body;

    const movementData: MovementInputData = {
      localBookId,
      amount,
      isLoan,
      total,
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
