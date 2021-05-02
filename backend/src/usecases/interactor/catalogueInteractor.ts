import { Catalogue, CatalogueInputData } from 'src/domain/model';
import { CatalogueRepository } from 'src/interface/repository';
import { ILogger } from '../interfaces/logger';

export default class CatalogueInteractor {
  private catalogueRepository: CatalogueRepository;

  private logger: ILogger;

  constructor(catalogueRepository: CatalogueRepository, logger: ILogger) {
    this.catalogueRepository = catalogueRepository;
    this.logger = logger;
  }

  findByISBNOrNone(isbn: string): Promise<Catalogue> {
    throw new Error('Method not implemented.');
  }

  registerCatalogue(catalogueData: CatalogueInputData): Promise<Catalogue> {
    throw new Error('Method not implemented.');
  }
}
