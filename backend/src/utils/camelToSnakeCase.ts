const camelToSnakeCase = (str: string) => (
  str[0].toLowerCase() + str.slice(1, str.length).replace(
    /[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`,
  )
);

export default camelToSnakeCase;
