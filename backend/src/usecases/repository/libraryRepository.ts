import { Maybe } from 'src/@types';
import { Library } from 'src/domain/model';

export interface ILibraryRepository {
  findOneByID(id: Library['id']): Promise<Maybe<Library>>;
  listAll(): Promise<Library[]>;
  createLibrary(libraryData:Library): Promise<Library['id']>;
  updateLibrary(libraryData: Omit<Library, 'id'>): Promise<Library>;
  getLibrary(id:string): Promise<Library[]>;
}
