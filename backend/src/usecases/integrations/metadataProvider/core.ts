import { Book } from 'src/domain/model';

export default interface IMetadataProviderCore {
  getOneByISBN(isbn: string): Promise<Book>;
}
