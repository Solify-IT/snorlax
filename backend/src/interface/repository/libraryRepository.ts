import { Maybe } from 'src/@types';
import { Library, LIBRARY_TABLE_NAME } from 'src/domain/model';
import { ILibraryRepository } from 'src/usecases';
import { IDatastore } from '.';

export default class LibraryRepository implements ILibraryRepository {
  datastore: IDatastore;

  constructor(datastore: IDatastore) {
    this.datastore = datastore;
  }

  async findOneByID(id: string): Promise<Maybe<Library>> {
    const library = await this.datastore.getById<Library>(LIBRARY_TABLE_NAME, id);

    return library;
  }
}
