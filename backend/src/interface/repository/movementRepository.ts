import { Movement, MovementInputData, MOVEMENT_TABLE_NAME } from 'src/domain/model';
import { IMovementRepository } from 'src/usecases';
import { v4 as uuidv4 } from 'uuid';
import BaseRepository from './BaseRepository';

export default class MovementRepository extends BaseRepository implements IMovementRepository {
  async registerMovement(movementData: MovementInputData): Promise<Movement['id']> {
    const id = uuidv4();

    const result = await this.datastore.insert<Movement>(MOVEMENT_TABLE_NAME, {
      ...movementData, id,
    });

    return result;
  }

  async getTodaySale(date: any):Promise<any> {
    console.log(date);
    console.log(`
    SELECT to_char(movements.created_at,'YYYY-MM-DD') as fecha, count(movements.created_at) as total_count,
       sum(local_books.price) as total
    FROM ${MOVEMENT_TABLE_NAME},local_books
    WHERE local_books.id = movements.local_book_id AND movements.type = 'out-sale' and to_char(movements.created_at,'YYYY-MM-DD') = '${date}'
    GROUP BY fecha
    ORDER BY fecha
    `);
    return this.datastore.get<string>(`
    SELECT to_char(movements.created_at,'YYYY-MM-DD') as fecha, count(movements.created_at) as total_count,
       sum(local_books.price) as total
    FROM ${MOVEMENT_TABLE_NAME},local_books
    WHERE local_books.id = movements.local_book_id AND movements.type = 'out-sale' and to_char(movements.created_at,'YYYY-MM-DD') = '${date}'
    GROUP BY fecha
    ORDER BY fecha
    `);
  }
}
