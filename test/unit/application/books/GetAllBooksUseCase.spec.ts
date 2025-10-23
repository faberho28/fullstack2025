import { GetAllBooksUseCase } from '../../../../src/application/use-cases/books/GetAllBooksUseCase';
import { Book } from '../../../../src/domain/entities/Book.entity';
import { BookNotFoundException } from '../../../../src/domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../../../src/domain/interfaces/IBookRepository';
import { ISBN } from '../../../../src/domain/value-objects/ISBN.vo';

describe('GetAllBooksUseCase', () => {
  let getAllBooksUseCase: GetAllBooksUseCase;

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

    getAllBooksUseCase = new GetAllBooksUseCase(bookRepository);
  });

  it('Should return all books when they exist', async () => {
    const books = [
      new Book(
        'book-1',
        ISBN.create('978-0-13-468599-1'),
        'Clean Code',
        'Robert C. Martin',
        2008,
        'Software Engineering',
        3,
        5,
      ),
      new Book(
        'book-2',
        ISBN.create('978-0-59-600712-6'),
        'The Pragmatic Programmer',
        'Andrew Hunt',
        1999,
        'Software Engineering',
        2,
        4,
      ),
    ];

    bookRepository.findAll.mockResolvedValue(books);

    const result = await getAllBooksUseCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(books);
    expect(bookRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should throw BookNotFoundException if no books exist', async () => {
    bookRepository.findAll.mockResolvedValue([]);

    await expect(getAllBooksUseCase.execute()).rejects.toThrow(BookNotFoundException);

    expect(bookRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should propagate unexpected repository errors', async () => {
    bookRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(getAllBooksUseCase.execute()).rejects.toThrow('Database error');
  });
});
