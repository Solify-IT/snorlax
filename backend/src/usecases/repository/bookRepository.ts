import { Book } from 'src/domain/model';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
}
