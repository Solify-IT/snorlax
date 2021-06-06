import {
  Movement, MovementInputData, MOVEMENT_TABLE_NAME, BOOK_TABLE_NAME,
} from 'src/domain/model';
import { IMovementRepository } from 'src/usecases';
import { v4 as uuidv4 } from 'uuid';
import BaseRepository from './BaseRepository';

export default class MovementRepository extends BaseRepository implements IMovementRepository {
  listAllMovements(): Promise<Movement[]> {
    return this.datastore.get(`SELECT to_char(${MOVEMENT_TABLE_NAME}.created_at,'YYYY-MM-DD HH-MI-SS') as fecha ,${MOVEMENT_TABLE_NAME}.type as typ,
     count(${MOVEMENT_TABLE_NAME}.created_at) as total_count,
     sum(${MOVEMENT_TABLE_NAME}.amount) as units,
     sum(${MOVEMENT_TABLE_NAME}.amount * CAST(${MOVEMENT_TABLE_NAME}.total AS int)) as total
    FROM ${MOVEMENT_TABLE_NAME} ,${BOOK_TABLE_NAME} 
    WHERE ${BOOK_TABLE_NAME}.id = ${MOVEMENT_TABLE_NAME}.local_book_id
    GROUP BY fecha,typ
    ORDER BY fecha desc`);
  }

  async registerMovement(movementData: MovementInputData): Promise<Movement['id']> {
    const id = uuidv4();

    const result = await this.datastore.insert<Movement>(MOVEMENT_TABLE_NAME, {
      ...movementData, id,
    });

    return result;
  }

  async getTodaySale(date: any):Promise<any> {
    return this.datastore.get<string>(`
    SELECT to_char(movements.created_at,'YYYY-MM-DD') as fecha, sum(movements.amount) as total_count,
    sum(movements.amount * CAST(movements.total AS int)) as total
    FROM movements
    WHERE movements.type = 'Venta' and to_char(movements.created_at,'YYYY-MM-DD') = '${date}'
    GROUP BY fecha
    ORDER BY fecha
    `);
  }
}
