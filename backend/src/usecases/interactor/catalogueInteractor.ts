import { Maybe } from 'src/@types';
import { Catalogue, CatalogueInputData } from 'src/domain/model';
import { InventoryCSV } from 'src/domain/model/catalogue';
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
    const id = await this.catalogueRepository.registerCatalogue(catalogueData);
    return { ...catalogueData, id };
  }

  async registerCatalogueBatch(records: InventoryCSV[]): Promise<any> {
    const isbnsFoundInCatalogue: any[] = await this
      .catalogueRepository.findByISBNs(records.map((record) => record.ISBN));

    const recordsNotFoundInCatalogue: InventoryCSV[] = [];

    records.forEach((record) => {
      const found = isbnsFoundInCatalogue.find((element) => element.isbn === record.ISBN);
      if (found === undefined) {
        recordsNotFoundInCatalogue.push(record);
      }
    });

    const operations: any[] = [];
    recordsNotFoundInCatalogue.forEach((record) => {
      let url = record.URL;
      if (!url) {
        url = 'https://images.vexels.com/media/users/3/194604/isolated/preview/96aa09d59cda8a3f112bada160a1d383-icono-plano-de-libro-de-texto-escolar-by-vexels.png';
      }
      operations.push(this.catalogueRepository.registerCatalogue({
        title: record.TITULO,
        isbn: record.ISBN,
        unitaryCost: Number.parseFloat(record.COSTO_UNITARIO),
        author: record.AUTOR,
        editoral: record.EDITORIAL,
        area: record.AREA,
        theme: record.TEMA,
        subTheme: record.SUBTEMA,
        collection: record.COLECCION,
        provider: record.PROVEEDOR,
        type: record.TIPO_PRODUCTO,
        coverType: '',
        coverImageUrl: url,
        subCategory: record.SUBCATEGORIA,
        distribuitor: record.DISTRIBUIDOR,
        synopsis: record.SINOPSIS,
        pages: Number.parseInt(record.PAGINAS, 10),
        libraryName: '',
        libraryPhone: '',
      }));
    });
    await Promise.all(operations);
    return 'ok';
  }

  private validateRegisterData(catalogueData: CatalogueInputData): void {
    let message = '';

    if (!catalogueData.isbn || catalogueData.isbn.length !== 13) {
      message += 'El item del cat??logo debe tener un ISBN v??lido. ';
    }

    if (!catalogueData.title) {
      message += 'El item del cat??logo debe tener t??tulo. ';
    }

    if (!catalogueData.author) {
      message += 'El item del cat??logo debe tener autor. ';
    }

    if (catalogueData.pages < 0) {
      message += 'El item del cat??logo debe tener p??ginas v??lidas. ';
    }

    if (message !== '') {
      this.logger.error({
        message, logger: 'CatalogueInteractor', event: 'validateRegisterData:InvalidDataError',
      });
      throw new InvalidDataError(message);
    }
  }
}
