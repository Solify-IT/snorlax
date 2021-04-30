import { Catalogue, CatalogueInputData } from 'src/domain/model';
import ICatalogueRepository from 'src/usecases/repository/catalogueRepository';
import BaseRepository from './BaseRepository';

export default class CatalogueRepository extends BaseRepository implements ICatalogueRepository {
  findByISBNOrNone(isbn: string): Promise<Catalogue> {
    throw new Error('Method not implemented.');
  }

  registerCatalogue(catalogueData: CatalogueInputData): Promise<Catalogue> {
    throw new Error('Method not implemented.');
  }
}
