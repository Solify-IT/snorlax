import { Movement, MovementInputData, MOVEMENT_TABLE_NAME } from 'src/domain/model';
import { IMovementRepository } from 'src/usecases';
import { v4 as uuidv4 } from 'uuid';
import { IDatastore } from '.';

export default class MovementRepository implements IMovementRepository {
  private datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  async registerMovement(movementData: MovementInputData): Promise<Movement['id']> {
    const id = uuidv4();

    const result = await this.datastore.insert<Movement>(MOVEMENT_TABLE_NAME, {
      ...movementData, id,
    });

    return result;
  }
}
