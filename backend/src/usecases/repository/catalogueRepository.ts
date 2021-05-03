import { Maybe } from 'src/@types';
import { Catalogue, CatalogueInputData } from 'src/domain/model';

export default interface ICatalogueRepository {
  findByISBNOrNull(isbn: string): Promise<Maybe<Catalogue>>;
  registerCatalogue(catalogueData: CatalogueInputData): Promise<Catalogue['id']>;
}
