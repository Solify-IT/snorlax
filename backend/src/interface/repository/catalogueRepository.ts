import { Maybe } from 'src/@types';
import { Catalogue, CatalogueInputData, CATALOGUE_TABLE_NAME } from 'src/domain/model';
import ICatalogueRepository from 'src/usecases/repository/catalogueRepository';
import BaseRepository from './BaseRepository';

export default class CatalogueRepository extends BaseRepository implements ICatalogueRepository {
  async findByISBNOrNull(isbn: string): Promise<Maybe<Catalogue>> {
    return this.datastore.getOneOrNull(
      `SELECT * FROM ${CATALOGUE_TABLE_NAME} WHERE isbn = $1`, [isbn],
    );
  }

  registerCatalogue(catalogueData: CatalogueInputData): Promise<Catalogue['id']> {
    throw new Error('Method not implemented.');
  }
}
