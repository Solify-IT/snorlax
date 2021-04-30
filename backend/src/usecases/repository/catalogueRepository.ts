import { Catalogue, CatalogueInputData } from 'src/domain/model';

export default interface ICatalogueRepository {
  findByISBNOrNone(isbn: string): Promise<Catalogue>;
  registerCatalogue(catalogueData: CatalogueInputData): Promise<Catalogue>;
}
