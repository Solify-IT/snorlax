export type Maybe<T> = T | null;

export type WithError<T> = Promise<[T | null, Error]>;

export async function wrapError<T>(
  p: Promise<T>,
): WithError<T> {
  try {
    return [await p, null];
  } catch (err) {
    return [null, err];
  }
}
