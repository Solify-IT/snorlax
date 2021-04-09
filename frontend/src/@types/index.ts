/* eslint-disable import/prefer-default-export */
import {
  Book, LocalBook, ExternalBook, BOOK_TABLE_NAME, LocalBookInput,
} from './book';

import { Library, LIBRARY_TABLE_NAME } from './library';

import CommonType from './common';

import Movement, { MovementInputData, MOVEMENT_TABLE_NAME } from './movement';

export type Maybe<T> = T | null;

export type WithError<T> = Promise<[T | null, Error | null]>;

export async function wrapError<T>(
  p: Promise<T>,
): WithError<T> {
  try {
    return [await p, null];
  } catch (err) {
    return [null, err];
  }
}

export {
  BOOK_TABLE_NAME,

  LIBRARY_TABLE_NAME,

  MOVEMENT_TABLE_NAME,
};
export type {
  Book,
  LocalBook,
  ExternalBook,

  CommonType,
  Library,

  LocalBookInput,
  Movement,
  MovementInputData,
};
