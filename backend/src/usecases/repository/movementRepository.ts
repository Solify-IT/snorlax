import { Movement, MovementInputData } from 'src/domain/model';
import { ReportInput } from 'src/domain/model/movement';

export default interface IMovementRepository {
  registerMovement(movementData: MovementInputData): Promise<Movement['id']>;
  getTodaySale(ts: number): Promise<any>;
  getMovementReport(movementData: ReportInput):Promise<any>;
  listAllMovements(): Promise<Movement[]>;
}
