import { IMovementRepository } from '..';
import { ILogger } from '../interfaces/logger';

export default class MovementInteractor {
  private movementRepository: IMovementRepository;

  private logger: ILogger;

  constructor(movementRepository: IMovementRepository, logger: ILogger) {
    this.movementRepository = movementRepository;
    this.logger = logger;
  }
}
