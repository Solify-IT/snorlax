import Api from './api';

export default class CRUD<T, C = any, U = any> extends Api {
  public getAll = () => this.get<T[]>('/');

  // TODO: Create new class to separate this method, since it is just used for establishments
  public getOne = (slug: string) => this.get<T>(`/${slug}`);

  public getOneById = (id: number) => this.get<T>(`/${id}`);

  public createOne = (data: C) => this.post<T, C>('/', data);

  public updateOne = (id: number, data: U) => this.patch<T, U>(`/${id}`, data);

  public disableOne = (id: number) => this.patch<number, undefined>(`/${id}`);

  public deleteOne = (id: number) => this.delete<number, undefined>(`/${id}`);
}
