import { FindBookByIdUseCase } from '../../../../src/application/use-cases/books/FindBookByIdUseCase';
import { Book } from '../../../../src/domain/entities/Book.entity';
import { BookNotFoundException } from '../../../../src/domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../../../src/domain/interfaces/IBookRepository';
import { ISBN } from '../../../../src/domain/value-objects/ISBN.vo';

describe('FindBookByIdUseCase', () => {
  let findBookByIdUseCase: FindBookByIdUseCase;

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

    findBookByIdUseCase = new FindBookByIdUseCase(bookRepository);
  });

  it('Should return a book when it exists', async () => {
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

    const result = await findBookByIdUseCase.execute('book-id');

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Book);
    expect(result.id).toBe('book-id');
    expect(bookRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).toHaveBeenCalledWith('book-id');
  });

  it('Should throw BookNotFoundException if book does not exist', async () => {
    bookRepository.findById.mockResolvedValue(null);

    await expect(findBookByIdUseCase.execute('non-existent-id')).rejects.toThrow(
      BookNotFoundException,
    );

    expect(bookRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });

  it('Should propagate unexpected repository errors', async () => {
    bookRepository.findById.mockRejectedValue(new Error('Database connection failed'));

    await expect(findBookByIdUseCase.execute('book-id')).rejects.toThrow(
      'Database connection failed',
    );
  });
});
