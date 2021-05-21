import { Maybe } from 'src/@types';
import { CommonType } from 'src/domain/model';

export default interface IDatastore {
  get<T>(queryText: string, values?: any[]): Promise<T[]>;
  getById<T>(tablenName: string, id: string): Promise<Maybe<T>>;
  getOne<T>(queryText: string, values?: any[]): Promise<T>;
  getOneOrNull<T>(queryText: string, values?: any[]): Promise<Maybe<T>>;
  insert<T extends CommonType>(
    tableName: string, values: T,
  ): Promise<CommonType['id']>;
  update<T, Y>(
    tableName: string, where: string, values: Y,
  ): Promise<T>;
}
