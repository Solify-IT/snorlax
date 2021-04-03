import { Maybe } from 'src/@types';
import { ExternalBook } from 'src/domain/model';

export default interface IMetadataProviderCore {
  getOneByISBN(isbn: string): Promise<Maybe<ExternalBook>>;
}
