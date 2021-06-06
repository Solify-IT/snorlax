import { Movement, MovementInputData } from 'src/domain/model';
import { IMovementRepository } from '..';
import { InvalidDataError } from '../errors';
import { ILogger } from '../interfaces/logger';

export default class MovementInteractor {
  private movementRepository: IMovementRepository;

  private logger: ILogger;

  constructor(movementRepository: IMovementRepository, logger: ILogger) {
    this.movementRepository = movementRepository;
    this.logger = logger;
  }

  async getTodaySale(date: any): Promise<any> {
    return this.movementRepository.getTodaySale(date);
  }

  async listAllmovements(): Promise<Movement[]> {
    return this.movementRepository.listAllMovements();
  }

  async registerMovement(data: MovementInputData): Promise<Movement['id']> {
    this.validateMovementData(data);
    return this.movementRepository.registerMovement(data);
  }

  private validateMovementData(data: MovementInputData): void {
    let message = '';

    if (data.amount <= 0) {
      message += 'The amount of books must be greater than 0. ';
    }

    if (message !== '') {
      this.logger.error(
        message,
        { data, logger: 'bookInteractor' },
      );
      throw new InvalidDataError(message);
    }
  }
}
