import axios from 'axios';
import { GoogleBooksService } from 'src/infrastructure/integrations';
import { ExternalBookFactory } from 'src/infrastructure/factories';

jest.mock('axios');

describe('GoogleBooksService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test('get method', async () => {
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

    console.log({ result, expectedBook });
    expect(result).toEqual(expectedBook);
  });
});
