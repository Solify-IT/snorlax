import { Movement, MovementInputData } from 'src/domain/model';

export default interface IMovementRepository {
  registerMovement(movementData: MovementInputData): Promise<Movement['id']>;
  getTodaySale(date:any): Promise<any>;
  listAllMovements(): Promise<Movement[]>;
}
