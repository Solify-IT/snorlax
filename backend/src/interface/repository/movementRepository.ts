import {
  Movement, MovementInputData, MOVEMENT_TABLE_NAME, BOOK_TABLE_NAME,
} from 'src/domain/model';
import { ReportInput } from 'src/domain/model/movement';
import { IMovementRepository } from 'src/usecases';
import { v4 as uuidv4 } from 'uuid';
import BaseRepository from './BaseRepository';

export default class MovementRepository extends BaseRepository implements IMovementRepository {
  listAllMovements(libraryId: string): Promise<Movement[]> {
    console.log(`SELECT to_char(${MOVEMENT_TABLE_NAME}.created_at,'YYYY-MM-DD HH-MI-SS') as fecha ,${MOVEMENT_TABLE_NAME}.type as typ,
    count(${MOVEMENT_TABLE_NAME}.created_at) as total_count,
    sum(${MOVEMENT_TABLE_NAME}.amount) as units,
    sum(${MOVEMENT_TABLE_NAME}.amount * CAST(${MOVEMENT_TABLE_NAME}.total AS int)) as total
   FROM ${MOVEMENT_TABLE_NAME} ,${BOOK_TABLE_NAME} 
   WHERE ${BOOK_TABLE_NAME}.id = ${MOVEMENT_TABLE_NAME}.local_book_id and
   movements.local_book_id = local_books.id and local_books.library_id = '${libraryId}'
   GROUP BY fecha,typ
   ORDER BY fecha desc`);
    return this.datastore.get(`SELECT to_char(${MOVEMENT_TABLE_NAME}.created_at,'YYYY-MM-DD HH-MI-SS') as fecha ,${MOVEMENT_TABLE_NAME}.type as typ,
    count(${MOVEMENT_TABLE_NAME}.created_at) as total_count,
    sum(${MOVEMENT_TABLE_NAME}.amount) as units,
    sum(${MOVEMENT_TABLE_NAME}.amount * CAST(${MOVEMENT_TABLE_NAME}.total AS int)) as total
   FROM ${MOVEMENT_TABLE_NAME} ,${BOOK_TABLE_NAME} 
   WHERE ${BOOK_TABLE_NAME}.id = ${MOVEMENT_TABLE_NAME}.local_book_id and
   movements.local_book_id = local_books.id and local_books.library_id = '${libraryId}'
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

  async getMovementReport(movementData: ReportInput): Promise<any> {
    let date = new Date(Number.parseInt(movementData.fechaInitial, 10));
    let year = date.getUTCFullYear();
    let month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1).toString()}` : (date.getMonth() + 1).toString();
    let day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate().toString();
    const parsedInitialDate = `${year}-${month}-${day}`;

    date = new Date(Number.parseInt(movementData.fechaEnd, 10));
    year = date.getUTCFullYear();
    month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1).toString()}` : (date.getMonth() + 1).toString();
    day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate().toString();
    const parsedEndDate = `${year}-${month}-${day}`;

    return this.datastore.get(`
      SELECT
        to_char(${MOVEMENT_TABLE_NAME}.created_at,'YYYY-MM-DD') as fecha,
        ${MOVEMENT_TABLE_NAME}.type as typ,
        count(${MOVEMENT_TABLE_NAME}.created_at) as total_count,
        sum(${MOVEMENT_TABLE_NAME}.amount) as units,
        sum(${MOVEMENT_TABLE_NAME}.amount * CAST(${MOVEMENT_TABLE_NAME}.total AS int)) as total
      FROM ${MOVEMENT_TABLE_NAME} 
      WHERE ${MOVEMENT_TABLE_NAME}.type='${movementData.type}' AND to_char(${MOVEMENT_TABLE_NAME}.created_at,'YYYY-MM-DD') between '${parsedInitialDate}' and '${parsedEndDate}'
      GROUP BY 1, 2
      ORDER BY fecha desc
    `);
  }

  async getTodaySale(ts: number, libraryId: string):Promise<any> {
    const date = new Date(ts);
    const year = date.getUTCFullYear();
    const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1).toString()}` : (date.getMonth() + 1).toString();
    const day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate().toString();
    const parsedDate = `${year}-${month}-${day}`;
    return this.datastore.get<string>(`
    SELECT to_char(movements.created_at,'YYYY-MM-DD') as fecha, sum(movements.amount) as total_count,
    sum(movements.amount * CAST(movements.total AS int)) as total
    FROM movements,local_books
    WHERE movements.type = 'Venta' and to_char(movements.created_at,'YYYY-MM-DD') = '${parsedDate}' and
    movements.local_book_id = local_books.id and local_books.library_id = '${libraryId}'
    GROUP BY fecha
    ORDER BY fecha
    `);
  }
}
