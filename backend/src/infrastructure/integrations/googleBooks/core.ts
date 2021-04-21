import axios from 'axios';
import { Maybe, wrapError } from 'src/@types';
import { ExternalBook } from 'src/domain/model';
import IMetadataProviderCore from 'src/usecases/interfaces/metadataProvider';

const GOOGLE_BOOKS_URL_API = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class GoogleBooksService implements IMetadataProviderCore {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || GOOGLE_BOOKS_URL_API;
  }

  async getOneByISBN(isbn: string): Promise<Maybe<ExternalBook>> {
    const [result, error] = await wrapError(this.get(`${isbn}+isbn&maxResults=1`));

    if (error) {
      throw error;
    }

    const foundIsbn = result.data.items[0].volumeInfo.industryIdentifiers[0].identifier;

    // if (foundIsbn !== isbn) {
    //   return null;
    // }

    const book: ExternalBook = {
      authors: result.data.items[0].volumeInfo.authors,
      title: result.data.items[0].volumeInfo.title,
      isbn: foundIsbn,
    };

    return book;
  }

  private async get(searchCriteria: string): Promise<any> {
    return axios.get(`${this.baseURL}${searchCriteria}`);
  }
}
