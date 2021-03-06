import { Maybe } from 'src/@types';
import { Library } from 'src/domain/model';
import { LibraryInput } from 'src/domain/model/library';
import { v4 as uuidv4 } from 'uuid';
import { ILibraryRepository } from '..';
import { InvalidDataError } from '../errors';
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

  async getLibrary(id: string): Promise<Library[]> {
    return this.libraryRepository.getLibrary(id);
  }

  async updateLibrary(libraryData: Omit<LibraryInput, 'id'>): Promise<Library> {
    this.logger.info('Updating library.', { logger: 'LibraryInteractor:updateLibrary' });

    this.validateLibraryData(libraryData);

    const result = await this.libraryRepository.updateLibrary({
      email: libraryData.email,
      name: libraryData.name,
      phoneNumber: libraryData.phoneNumber,
      state: libraryData.state,
      city: libraryData.city,
      address: libraryData.address,
      inCharge: libraryData.inCharge,
    });

    return result;
  }

  async createLibrary(libraryData: LibraryInput): Promise<Library['id']> {
    this.logger.info('Creating new library.', { logger: 'LibraryInteractor:createLibrary' });
    this.validateLibraryData(libraryData);

    const result = await this.libraryRepository.createLibrary({
      email: libraryData.email,
      name: libraryData.name,
      phoneNumber: libraryData.phoneNumber,
      state: libraryData.state,
      city: libraryData.city,
      address: libraryData.address,
      inCharge: libraryData.inCharge,
      id: uuidv4(),
    });

    return result;
  }

  private validateLibraryData(libraryData: LibraryInput) {
    let message = '';

    if (!libraryData.email || !libraryData.name || !libraryData.phoneNumber) {
      message += 'Missing data! ';
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(libraryData.email)) {
      message += 'The email is not valid. ';
    }

    if (message !== '') {
      this.logger.error(message, {
        libraryData, logger: 'libraryInteractor:validateLibraryData',
      });
      throw new InvalidDataError(message);
    }
  }

  async listAll(): Promise<Library[]> {
    return this.libraryRepository.listAll();
  }
}
