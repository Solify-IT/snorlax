import { Maybe } from 'src/@types';
import { Library } from 'src/domain/model';

export interface ILibraryRepository {
  findOneByID(id: Library['id']): Promise<Maybe<Library>>;
  listAll(): Promise<Library[]>;
}
