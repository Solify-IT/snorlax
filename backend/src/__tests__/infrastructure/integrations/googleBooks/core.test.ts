import axios from 'axios';
import { GoogleBooksService } from 'src/infrastructure/integrations';
import { BookFactory } from 'src/infrastructure/factories';

jest.mock('axios');

describe('GoogleBooksService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test('get method', async () => {
    const expectedBook = BookFactory.build({ price: 0 });
    const axiosResp = {
      data: {
        items: [
          {
            id: expectedBook.id,
            volumeInfo: {
              authors: [expectedBook.author],
              title: expectedBook.title,
              industryIdentifiers: [{ identifier: expectedBook.isbn }],
            },
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(axiosResp);

    const result = await new GoogleBooksService().getOneByISBN(expectedBook.isbn);

    expect(result).toEqual(expectedBook);
  });
});
