import { Maybe } from 'src/@types';
import { Library, LIBRARY_TABLE_NAME } from 'src/domain/model';
import { ILibraryRepository } from 'src/usecases';
import BaseRepository from './BaseRepository';

export default class LibraryRepository extends BaseRepository implements ILibraryRepository {
  async findOneByID(id: string): Promise<Maybe<Library>> {
    const library = await this.datastore.getById<Library>(LIBRARY_TABLE_NAME, id);

    return library;
  }

  async listAll(): Promise<Library[]> {
    return this.datastore.get(`SELECT * FROM ${LIBRARY_TABLE_NAME}`);
  }

  async createLibrary(libraryData: Library): Promise<Library['id']> {
    return this.datastore.insert<Library>(LIBRARY_TABLE_NAME, {
      ...libraryData,
    });
  }

  async updateLibrary(libraryData: Omit<Library, 'id'>): Promise<Library> {
    return this.datastore.update<Library, Omit<Library, 'id'>>(LIBRARY_TABLE_NAME, `name = '${libraryData.name}'`, {
      ...libraryData,
    });
  }
}
