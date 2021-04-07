/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pool, QueryResult } from 'pg';
import { wrapError } from 'src/@types';
import { CommonType } from 'src/domain/model';
import { IDatastore } from 'src/interface/repository';
import NotFoundError from 'src/usecases/errors/notFoundError';
import { ILogger } from 'src/usecases/interfaces/logger';
import camelToSnakeCase from 'src/utils/camelToSnakeCase';

export default class Datastore implements IDatastore {
  private dbPool: Pool;

  private logger: ILogger;

  constructor(dbPool: Pool, logger: ILogger) {
    this.dbPool = dbPool;
    this.logger = logger;
  }

  async get<T>(queryText: string, values?: any[]): Promise<T[]> {
    const [result, error] = await wrapError(
      this.dbPool.query(queryText, values),
    );

    if (error) {
      throw error;
    }

    if (!result) return [];

    return result.rows;
  }

  async getById<T>(tableName: string, id: string): Promise<T> {
    const query = `SELECT * FROM ${tableName} WHERE id = $1`;
    const [result, error] = await wrapError(this.dbPool.query<T>(query, [id]));

    if (error) {
      throw error;
    }

    if (!result) {
      const message = 'The object searched was not found';
      this.logger.error(message, {
        logger: 'datasotre:getById',
        id,
        tableName,
      });
      throw new NotFoundError(message);
    }

    return result.rows[0];
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
    const fields = Object.keys(values).map(camelToSnakeCase);
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
