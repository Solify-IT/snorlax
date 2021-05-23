/* eslint-disable import/prefer-default-export */
import {
  Book, LocalBook, ExternalBook, BOOK_TABLE_NAME, LocalBookInput, BookFormType,
} from './book';

import { Library, LIBRARY_TABLE_NAME } from './library';

import CommonType from './common';

import Movement, { MovementInputData, MOVEMENT_TABLE_NAME } from './movement';

import Catalogue from './catalogue';

export type Maybe<T> = T | null;

export type WithError<T, E = Error> = Promise<[T | null, E | null]>;

export async function wrapError<T, E = Error>(
  p: Promise<T>,
): WithError<T, E> {
  try {
    return [await p, null];
  } catch (err) {
    return [null, err];
  }
}

export type {
  Book,
  BookFormType,
  BOOK_TABLE_NAME,
  Catalogue,
  CommonType,
  ExternalBook,
  Library,
  LIBRARY_TABLE_NAME,
  LocalBook,
  LocalBookInput,
  Movement,
  MovementInputData,
  MOVEMENT_TABLE_NAME,
};
