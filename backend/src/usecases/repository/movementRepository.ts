import { Movement, MovementInputData } from 'src/domain/model';
import { ReportMovementInput } from 'src/domain/model/movement';

export default interface IMovementRepository {
  registerMovement(movementData: MovementInputData): Promise<Movement['id']>;
  getTodaySale(ts: number): Promise<any>;
  getMovementReport(movementData: ReportMovementInput):Promise<any>;
  listAllMovements(): Promise<Movement[]>;
}
