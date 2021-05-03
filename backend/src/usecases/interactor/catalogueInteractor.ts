import { Maybe } from 'src/@types';
import { Catalogue, CatalogueInputData } from 'src/domain/model';
import { CatalogueRepository } from 'src/interface/repository';
import { InvalidDataError } from '../errors';
import { ILogger } from '../interfaces/logger';

export default class CatalogueInteractor {
  private catalogueRepository: CatalogueRepository;

  private logger: ILogger;

  constructor(catalogueRepository: CatalogueRepository, logger: ILogger) {
    this.catalogueRepository = catalogueRepository;
    this.logger = logger;
  }

  findByISBNOrNull(isbn: string): Promise<Maybe<Catalogue>> {
    return this.catalogueRepository.findByISBNOrNull(isbn);
  }

  async registerCatalogue(catalogueData: CatalogueInputData): Promise<Catalogue> {
    this.validateRegisterData(catalogueData);
    return this.catalogueRepository.registerCatalogue(catalogueData);
  }

  private validateRegisterData(catalogueData: CatalogueInputData): void {
    let message = '';

    if (!catalogueData.isbn || catalogueData.isbn.length !== 13) {
      message += 'El item del catálogo debe tener un ISBN válido. ';
    }

    if (!catalogueData.title) {
      message += 'El item del catálogo debe tener título. ';
    }

    if (!catalogueData.author) {
      message += 'El item del catálogo debe tener autor. ';
    }

    if (catalogueData.pages < 0) {
      message += 'El item del catálogo debe tener páginas válidas. ';
    }

    if (message !== '') {
      this.logger.error({
        message, logger: 'CatalogueInteractor', event: 'validateRegisterData:InvalidDataError',
      });
      throw new InvalidDataError(message);
    }
  }
}
