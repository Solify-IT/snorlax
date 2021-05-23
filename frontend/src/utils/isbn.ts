const formatISBN = (isbn: string) => {
  const matches = isbn.match(/^(\d{3})(\d{1})(\d{5})(\d{3})(\d{1})$/);
  if (!matches) {
    throw Error(`${isbn} is not a valid ISBN`);
  }

  return `${matches[1]}-${matches[2]}-${matches[3]}-${matches[4]}-${matches[5]}`;
};

export default formatISBN;
