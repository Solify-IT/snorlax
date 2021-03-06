import Api from './api';

export default class CRUD<T = any, C = any, U = any> extends Api {
  public getAll = <A = T[]>(filter: string = '') => this.get<A>(
    `/${filter !== '' ? '?' : ''}${filter || ''}`,
  );

  public getAllObject = <A = T>(filter: string = '') => this.get<A>(
    `${filter !== '' ? '?' : ''}${filter || ''}`,
  );

  // TODO: Create new class to separate this method, since it is just used for establishments
  public getOne = (slug: string) => this.get<T>(`/${slug}`);

  public getOneById = <A = T>(id: string) => this.get<A>(`/${id}`);

  public createOne = (data: C) => this.post<T, C>('/', data);

  public updateOne = (id: string, data: U) => this.patch<T, U>(`/${id}`, data);

  public updateOneK = (data: C) => this.patch<T, C>('/', data);

  public disableOne = (id: string) => this.patch<string, undefined>(`/${id}`);

  public deleteOne = (id: string) => this.delete<string>(`/${id}`);
}
