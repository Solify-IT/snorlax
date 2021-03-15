/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { wrapError } from 'src/@types';
import { Book } from 'src/domain/model';
import { IDatastore } from 'src/interface/repository';

export default class Datastore implements IDatastore {
  get<T>(queryText: string, values?: any[]): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  getById<T>(tablenName: string, id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  getOne<T>(queryText: string, values?: any[]): Promise<T> {
    throw new Error('Method not implemented.');
  }

  getOneOrNull<T>(queryText: string, values?: any[]): Promise<T> {
    throw new Error('Method not implemented.');
  }

  books: {
    query(queryText?: string): Promise<Book[]>;
    getByISBN(isbn: string): Promise<Book>;
  };

  constructor() {
    const getByISBN = (isbn: string): Promise<Book> => {
      throw new Error('Method not implemented.');
    };

    const query = async (): Promise<Book[]> => {
      const [result, error] = await wrapError(
        axios.get<{ items: any[] }>(
          'https://www.googleapis.com/books/v1/volumes?q=lord+of+the+rings',
        ),
      );

      if (error) {
        throw error;
      }

      const books: Book[] = [];

      result.data.items.forEach((book) => {
        books.push({
          id: book.id,
          author: book.volumeInfo.authors[0],
          price: 0,
          title: book.volumeInfo.title,
          isbn: book.volumeInfo.industryIdentifiers[0].identifier,
        });
      });

      return books;
    };

    this.books = { query, getByISBN };
  }
}
