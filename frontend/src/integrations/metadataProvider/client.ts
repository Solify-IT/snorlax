import axios, {
  AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError,
} from 'axios';
import { ExternalBook, WithError, wrapError } from 'src/@types';

export default class Client {
  private api: AxiosInstance;

  public constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.api = axios.create(config);
    this.api.interceptors.request.use((param: AxiosRequestConfig) => ({
      baseURL,
      ...param,
    }));
  }

  async getByISBN(
    isbn: string, max: number = 3,
  ): WithError<ExternalBook[], AxiosError> {
    const [res, error] = await this.get<{ items: any[] }>(
      `${isbn}+isbn&maxResults=${max}`,
    );

    if (error || !res) return [null, error];

    const books: ExternalBook[] = [];

    const { items } = res.data;

    if (items) {
      items.forEach((item) => {
        const foundIsbn = item.volumeInfo.industryIdentifiers[0].identifier;
        books.push({
          authors: item.volumeInfo.authors,
          title: item.volumeInfo.title,
          isbn: foundIsbn,
          coverURL: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
        });
      });
    }

    return [books, null];
  }

  private async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<T> | null, AxiosError | null]> {
    return wrapError(this.api.get<T>(url, config));
  }
}
