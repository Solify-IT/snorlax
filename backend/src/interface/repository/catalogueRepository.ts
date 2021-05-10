import { Maybe } from 'src/@types';
import { Catalogue, CatalogueInputData, CATALOGUE_TABLE_NAME } from 'src/domain/model';
import ICatalogueRepository from 'src/usecases/repository/catalogueRepository';
import { v4 as uuid } from 'uuid';
import BaseRepository from './BaseRepository';

export default class CatalogueRepository extends BaseRepository implements ICatalogueRepository {
  async findByISBNOrNull(isbn: string): Promise<Maybe<Catalogue>> {
    return this.datastore.getOneOrNull(
      `SELECT * FROM ${CATALOGUE_TABLE_NAME} WHERE isbn = $1`, [isbn],
    );
  }

  async registerCatalogue(catalogueData: CatalogueInputData): Promise<Catalogue['id']> {
    const id = uuid();
    return this.datastore.insert(CATALOGUE_TABLE_NAME, { ...catalogueData, id });
  }
}
