import { Maybe } from 'src/@types';
import { Library } from 'src/domain/model';
import { ILibraryRepository } from '..';
import { ILogger } from '../interfaces/logger';

export default class LibraryInteractor {
  private libraryRepository: ILibraryRepository;

  private logger: ILogger;

  constructor(libraryRepository: ILibraryRepository, logger: ILogger) {
    this.libraryRepository = libraryRepository;
    this.logger = logger;
  }

  async getOneById(id: Library['id']): Promise<Maybe<Library>> {
    const result = await this.libraryRepository.findOneByID(id);

    return result;
  }

  async listAll(): Promise<Library[]> {
    return this.libraryRepository.listAll();
  }
}
