/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pool } from 'pg';
import { IDatastore } from 'src/interface/repository';

export default class Datastore implements IDatastore {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
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
}
