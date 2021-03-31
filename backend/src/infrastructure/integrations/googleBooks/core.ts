import axios from 'axios';
import { wrapError } from 'src/@types';
import { Book } from 'src/domain/model';
import IMetadataProviderCore from 'src/usecases/integrations/metadataProvider/core';

const GOOGLE_BOOKS_URL_API = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class GoogleBooksService implements IMetadataProviderCore {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || GOOGLE_BOOKS_URL_API;
  }

  async getOneByISBN(isbn: string): Promise<Book> {
    const [result, error] = await wrapError(this.get(`${isbn}+isbn&maxResults=1`));

    if (error) {
      throw error;
    }

    const book: Book = {
      id: result.data.items[0].id,
      author: result.data.items[0].volumeInfo.authors[0],
      price: 0,
      title: result.data.items[0].volumeInfo.title,
      isbn: result.data.items[0].volumeInfo.industryIdentifiers[0].identifier,
    };

    return book;
  }

  private async get(searchCriteria: string): Promise<any> {
    return axios.get(`${this.baseURL}${searchCriteria}`);
  }
}
