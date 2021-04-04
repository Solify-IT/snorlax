/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pool, QueryResult } from 'pg';
import { wrapError } from 'src/@types';
import { CommonType } from 'src/domain/model';
import { IDatastore } from 'src/interface/repository';
import { ILogger } from 'src/usecases/interfaces/logger';

export default class Datastore implements IDatastore {
  private dbPool: Pool;

  private logger: ILogger;

  constructor(dbPool: Pool, logger: ILogger) {
    this.dbPool = dbPool;
    this.logger = logger;
  }

  get<T>(queryText: string, values?: any[]): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  getById<T>(tablenName: string, id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  getOne<T>(queryText: string, values?: any[]): Promise<T> {
    throw new Error('Method not implemented.');
  }

  getOneOrNull<T>(queryText: string, values?: any[]): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async insert<T extends CommonType>(
    tableName: string, values: T,
  ): Promise<CommonType['id']> {
    const fields = Object.keys(values);
    const paramsPlaceholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      INSERT INTO ${tableName}(${fields})
      VALUES (${paramsPlaceholders})
      RETURNING *
    `;
    const data = Object.values(values);

    const [result, error] = await wrapError<QueryResult<T>>(
      this.dbPool.query<T>(query, data),
    );

    if (error) {
      this.logger.error('Error while inserting an object', {
        logger: 'datastore',
        tableName,
        values,
        error,
      });
      throw error;
    }

    return result!.rows[0].id;
  }
}
