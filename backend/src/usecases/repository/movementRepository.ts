import { Movement, MovementInputData } from 'src/domain/model';

export default interface IMovementRepository {
  registerMovement(movementData: MovementInputData): Promise<Movement['id']>;
  getTodaySale(ts: number): Promise<any>;
  listAllMovements(): Promise<Movement[]>;
}
