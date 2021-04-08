import { Movement, MovementInputData } from 'src/domain/model';
import { IMovementRepository } from 'src/usecases';
import { IDatastore } from '.';

export default class MovementRepository implements IMovementRepository {
  private datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  registerMovement(movementData: MovementInputData): Promise<Movement['id']> {
    throw new Error('Method not implemented.');
  }
}
