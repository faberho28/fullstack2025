import { Book } from '../../../../src/domain/entities/Book.entity';
import { ISBN } from '../../../../src/domain/value-objects/ISBN.vo';

describe('Book Entity', () => {
  const validISBN = ISBN.create('978-0-13-468599-1');

  it('should create a valid book', () => {
    const book = new Book(
      '123e4567-e89b-12d3-a456-426614174000',
      validISBN,
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      3,
      5,
    );

    expect(book).toBeDefined();
    expect(book.title).toBe('Clean Code');
    expect(book.author).toBe('Robert C. Martin');
    expect(book.getAvailableCopies()).toBe(3);
  });

  it('should throw error if ISBN is invalid', () => {
    expect(() => {
      ISBN.create('invalid-isbn');
    }).toThrow('Invalid ISBN format');
  });

  it('should decrease available copies when loaned', () => {
    const book = new Book(
      '123e4567-e89b-12d3-a456-426614174000',
      validISBN,
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      3,
      5,
    );

    book.decreaseAvailableCopies();
    expect(book.getAvailableCopies()).toBe(2);

    book.decreaseAvailableCopies();
    expect(book.getAvailableCopies()).toBe(1);
  });

  it('should increase available copies when returned', () => {
    const book = new Book(
      '123e4567-e89b-12d3-a456-426614174000',
      validISBN,
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      2,
      5,
    );

    book.increaseAvailableCopies();
    expect(book.getAvailableCopies()).toBe(3);
  });

  it('should throw error if title is empty', () => {
    expect(() => new Book('1', validISBN, '', 'Author', 2020, 'Category', 1, 1)).toThrow(
      'Book title cannot be empty',
    );
  });

  it('should throw error if author is empty', () => {
    expect(() => new Book('1', validISBN, 'Title', '', 2020, 'Category', 1, 1)).toThrow(
      'Book author cannot be empty',
    );
  });

  it('should throw error for invalid publication year', () => {
    expect(() => new Book('1', validISBN, 'Title', 'Author', 999, 'Category', 1, 1)).toThrow(
      'Invalid publication year',
    );
    expect(
      () =>
        new Book('1', validISBN, 'Title', 'Author', new Date().getFullYear() + 1, 'Category', 1, 1),
    ).toThrow('Invalid publication year');
  });

  it('should throw error if availableCopies > totalCopies', () => {
    expect(() => new Book('1', validISBN, 'Title', 'Author', 2020, 'Category', 10, 5)).toThrow(
      'Available copies cannot exceed total copies',
    );
  });

  it('should throw error if availableCopies < 0 or totalCopies < 0', () => {
    expect(() => new Book('1', validISBN, 'Title', 'Author', 2020, 'Category', -1, 5)).toThrow(
      'Available copies cannot be negative',
    );
    expect(() => new Book('1', validISBN, 'Title', 'Author', 2020, 'Category', 0, -5)).toThrow(
      'Total copies cannot be negative',
    );
  });

  it('should set available copies with setAvailableCopies', () => {
    const book = new Book('1', validISBN, 'Title', 'Author', 2020, 'Category', 2, 5);
    book.setAvailableCopies(4);
    expect(book.getAvailableCopies()).toBe(4);
    expect(() => book.setAvailableCopies(-1)).toThrow('Invalid available copies count');
    expect(() => book.setAvailableCopies(6)).toThrow('Invalid available copies count');
  });

  it('should update book properties', () => {
    const book = new Book('1', validISBN, 'Title', 'Author', 2020, 'Category', 2, 5);
    const updatedBook = book.update({
      title: 'New Title',
      availableCopies: 3,
    });
    expect(updatedBook.title).toBe('New Title');
    expect(updatedBook.getAvailableCopies()).toBe(3);
    expect(updatedBook.author).toBe('Author');
  });
});
