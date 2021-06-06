import axios, {
  AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError,
} from 'axios';
import { ExternalBook, WithError, wrapError } from 'src/@types';

const DEFAULT_CATALOGUE_ITEM: ExternalBook = {
  isbn: '',
  title: '',
  unitaryCost: 0,
  author: '',
  editoral: '',
  area: '',
  theme: '',
  subTheme: '',
  collection: '',
  provider: '',
  type: '',
  coverType: '',
  coverImageUrl: '',
  subCategory: '',
  distribuitor: '',
  synopsis: '',
  libraryName: '',
  libraryPhone: '',
  pages: 0,
};

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
          ...DEFAULT_CATALOGUE_ITEM,
          author: item.volumeInfo.authors.join(', '),
          title: item.volumeInfo.title,
          isbn: foundIsbn,
          coverImageUrl: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
          editoral: item.volumeInfo.publisher || '',
          pages: item.volumeInfo.pageCount || 0,
          area: item.volumeInfo.categories ? item.volumeInfo.categories.join(', ') : '',
          unitaryCost: item.saleInfo && item.saleInfo.listPrice ? item.saleInfo.listPrice.amount || '' : '',
          synopsis: item.volumeInfo.description || '',
          libraryName: item.volumeInfo.libraryName || '',
          libraryPhone: item.volumeInfo.libraryPhone || '',
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
