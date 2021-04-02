import axios from 'axios';
import { GoogleBooksService } from 'src/infrastructure/integrations';
import { ExternalBookFactory } from 'src/infrastructure/factories';

jest.mock('axios');

describe('GoogleBooksService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test('getOneByISBN should be successful with correct data', async () => {
    const expectedBook = ExternalBookFactory.build();
    const axiosResp = {
      data: {
        items: [
          {
            volumeInfo: {
              authors: expectedBook.authors,
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

  test('getOneByISBN should return null if isbn different than expected', async () => {
    const mockedBook = ExternalBookFactory.build();
    const axiosResp = {
      data: {
        items: [
          {
            volumeInfo: {
              authors: mockedBook.authors,
              title: mockedBook.title,
              industryIdentifiers: [{ identifier: 'unexpected' }],
            },
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(axiosResp);

    const result = await new GoogleBooksService().getOneByISBN(mockedBook.isbn);

    expect(result).toEqual(null);
  });
});
