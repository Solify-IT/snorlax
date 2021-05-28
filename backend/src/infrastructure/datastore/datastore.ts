/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pool, QueryResult } from 'pg';
import loadash from 'lodash';
import { Maybe, wrapError } from 'src/@types';
import { CommonType } from 'src/domain/model';
import { IDatastore } from 'src/interface/repository';
import NotFoundError from 'src/usecases/errors/notFoundError';
import { ILogger } from 'src/usecases/interfaces/logger';
import camelToSnakeCase from 'src/utils/camelToSnakeCase';
import { SaleMovementInput } from 'src/domain/model/book';

export default class Datastore implements IDatastore {
  private dbPool: Pool;

  private logger: ILogger;

  constructor(dbPool: Pool, logger: ILogger) {
    this.dbPool = dbPool;
    this.logger = logger;
  }

  async get<T>(queryText: string, values?: any[]): Promise<T[]> {
    const result = await this.dbPool.query(queryText, values);

    if (result.rowCount === 0) return [];

    return result.rows.map((el) => this.toCamel<T>(el));
  }

  async getById<T>(tableName: string, id: string): Promise<T> {
    const query = `SELECT * FROM ${tableName} WHERE id = $1`;
    const result = await this.dbPool.query<T>(query, [id]);

    if (result.rowCount === 0) {
      const message = 'The object searched was not found';
      this.logger.error(message, {
        logger: 'datasotre:getById',
        id,
        tableName,
      });
      throw new NotFoundError(message);
    }

    return this.toCamel<T>(result.rows[0]);
  }

  getOne<T>(queryText: string, values?: any[]): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async getOneOrNull<T>(queryText: string, values?: any[]): Promise<Maybe<T>> {
    const result = await this.dbPool.query<T>(queryText, values);
    return result.rowCount === 1 ? this.toCamel<T>(result.rows[0]) : null;
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

  async update<T, Y>(
    tableName: string, where:string, values: Y,
  ): Promise<T> {
    const fields = Object.keys(values).map(camelToSnakeCase);
    const data = Object.values(values);
    const paramsPlaceholders = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `
      UPDATE ${tableName} SET ${paramsPlaceholders} WHERE ${where}
      RETURNING *
    `;
    const [result, error] = await wrapError<QueryResult<T>>(
      this.dbPool.query<T>(query, data),
    );

    if (error) {
      this.logger.error('Error while updating an object', {
        logger: 'datastore',
        tableName,
        values,
        error,
      });
      throw error;
    }

    return result!.rows[0];
  }

  private toCamel<T>(obj: any) {
    return loadash.mapKeys(obj, (v, k) => loadash.camelCase(k)) as T;
  }
}
