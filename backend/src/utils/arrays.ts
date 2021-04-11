// eslint-disable-next-line import/prefer-default-export
export function asyncForEach(callback: ()) {
  return Promise.resolve(this).then(async (ar) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < ar.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await callback.call(ar, ar[i], i, ar);
    }
  });
}
