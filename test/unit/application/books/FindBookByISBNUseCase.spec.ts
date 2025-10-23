import { FindBookByISBNUseCase } from '../../../../src/application/use-cases/books/FindBookByISBNUseCase';
import { Book } from '../../../../src/domain/entities/Book.entity';
import { BookNotFoundException } from '../../../../src/domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../../../src/domain/interfaces/IBookRepository';
import { ISBN } from '../../../../src/domain/value-objects/ISBN.vo';

describe('FindBookByISBNUseCase', () => {
  let findBookByIsbnUseCase: FindBookByISBNUseCase;

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

    findBookByIsbnUseCase = new FindBookByISBNUseCase(bookRepository);
  });

  it('Should return a book when it exists for given ISBN', async () => {
    const isbnValue = '978-0-13-468599-1';
    const book = new Book(
      'book-id',
      ISBN.create(isbnValue),
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      3,
      5,
    );

    bookRepository.findByISBN.mockResolvedValue(book);

    const result = await findBookByIsbnUseCase.execute(isbnValue);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Book);
    expect(result.isbn.getValue()).toBe(isbnValue);
    expect(bookRepository.findByISBN).toHaveBeenCalledTimes(1);
    expect(bookRepository.findByISBN).toHaveBeenCalledWith(isbnValue);
  });

  it('Should throw BookNotFoundException if book does not exist for given ISBN', async () => {
    const isbnValue = '000-0-00-000000-0';
    bookRepository.findByISBN.mockResolvedValue(null);

    await expect(findBookByIsbnUseCase.execute(isbnValue)).rejects.toThrow(BookNotFoundException);

    expect(bookRepository.findByISBN).toHaveBeenCalledWith(isbnValue);
  });

  it('Should propagate unexpected repository errors', async () => {
    const isbnValue = '978-0-13-468599-1';
    bookRepository.findByISBN.mockRejectedValue(new Error('Database error'));

    await expect(findBookByIsbnUseCase.execute(isbnValue)).rejects.toThrow('Database error');
  });
});
