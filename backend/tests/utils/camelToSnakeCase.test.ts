import camelToSnakeCase from 'src/utils/camelToSnakeCase';

describe('camelToSnakeCase', () => {
  it('should convert camelCase to camel_case', () => {
    const result = camelToSnakeCase('camelCase');
    expect(result).toBe('camel_case');
  });

  it('should convert CamelCase to camel_case', () => {
    const result = camelToSnakeCase('CamelCase');
    expect(result).toBe('camel_case');
  });
});
