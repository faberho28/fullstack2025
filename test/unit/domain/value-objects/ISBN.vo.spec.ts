import { ISBN } from '../../../../src/domain/value-objects/ISBN.vo';

describe('ISBN Value Object', () => {
  it('should create a valid ISBN-10', () => {
    const isbn = ISBN.create('0-306-40615-2');
    expect(isbn).toBeInstanceOf(ISBN);
    expect(isbn.getValue()).toBe('0-306-40615-2');
  });

  it('should create a valid ISBN-13', () => {
    const isbn = ISBN.create('978-0-13-468599-1');
    expect(isbn).toBeInstanceOf(ISBN);
    expect(isbn.getValue()).toBe('978-0-13-468599-1');
  });

  it('should throw error for invalid ISBN', () => {
    expect(() => ISBN.create('1234567890')).toThrow(
      'Invalid ISBN format. Must be ISBN-10 or ISBN-13',
    );
    expect(() => ISBN.create('978-0-13-468599-9')).toThrow(
      'Invalid ISBN format. Must be ISBN-10 or ISBN-13',
    );
  });

  it('should validate correct ISBNs using isValid', () => {
    expect(ISBN.isValid('0-306-40615-2')).toBe(true);
    expect(ISBN.isValid('978-0-13-468599-1')).toBe(true);
  });

  it('should invalidate incorrect ISBNs using isValid', () => {
    expect(ISBN.isValid('1234567890')).toBe(false);
    expect(ISBN.isValid('978-0-13-468599-9')).toBe(false);
    expect(ISBN.isValid('invalid-isbn')).toBe(false);
  });

  it('should compare ISBNs using equals', () => {
    const isbn1 = ISBN.create('978-0-13-468599-1');
    const isbn2 = ISBN.create('978-0-13-468599-1');
    const isbn3 = ISBN.create('0-306-40615-2');

    expect(isbn1.equals(isbn2)).toBe(true);
    expect(isbn1.equals(isbn3)).toBe(false);
  });

  it('should return ISBN string via toString', () => {
    const isbn = ISBN.create('978-0-13-468599-1');
    expect(isbn.toString()).toBe('978-0-13-468599-1');
  });
});
