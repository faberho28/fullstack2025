import { CheckBookAvailabilityUseCase } from '../../../src/application/use-cases/CheckBookAvailabilityUseCase';
import { Book } from '../../../src/domain/entities/Book.entity';
import { BookNotFoundException } from '../../../src/domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../../src/domain/interfaces/IBookRepository';
import { ISBN } from '../../../src/domain/value-objects/ISBN.vo';

describe('CheckBookAvailabilityUseCase', () => {
  let checkBookAvailabilityUseCase: CheckBookAvailabilityUseCase;

  let bookRepository: jest.Mocked<IBookRepository>;

  beforeEach(() => {
    bookRepository = {
      findById: jest.fn(),
      findByISBN: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    checkBookAvailabilityUseCase = new CheckBookAvailabilityUseCase(bookRepository);
  });

  it('Should check book availability', async () => {
    const book = new Book(
      'book-id',
      ISBN.create('978-0-13-468599-1'),
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      3,
      5,
    );
    bookRepository.findById.mockResolvedValue(book);

    const bookId = 'book-id';

    const result = await checkBookAvailabilityUseCase.execute(bookId);
    expect(result).toBeDefined();
    expect(result.bookId).toBe('book-id');
    expect(bookRepository.findById).toHaveBeenCalled();
  });

  it("Should throw if book doesn't exist", async () => {
    bookRepository.findById.mockResolvedValue(null);

    const bookId = 'book-id';

    const result = checkBookAvailabilityUseCase.execute(bookId);

    await expect(result).rejects.toThrow(BookNotFoundException);
  });

  it('Should return unavailable when no copies are available', async () => {
    const book = new Book(
      'book-id',
      ISBN.create('978-0-13-468599-1'),
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      0,
      5,
    );
    bookRepository.findById.mockResolvedValue(book);

    const result = await checkBookAvailabilityUseCase.execute('book-id');

    expect(result.isAvailable).toBe(false);
    expect(result.availableCopies).toBe(0);
  });
});
