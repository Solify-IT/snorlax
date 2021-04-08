import { Movement } from 'src/domain/model';

export default interface IMovementRepository {
  registerMovement(movementData: Movement): Promise<Movement['id']>;
}
