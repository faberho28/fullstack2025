import { CreateBookDto } from '../../../../src/application/dtos/CreateBookDto';
import { CreateBookUseCase } from '../../../../src/application/use-cases/books/CreateBookUseCase';
import { Book } from '../../../../src/domain/entities/Book.entity';
import { IBookRepository } from '../../../../src/domain/interfaces/IBookRepository';
import { ISBN } from '../../../../src/domain/value-objects/ISBN.vo';

describe('CreateBookUseCase', () => {
  let createBookUseCase: CreateBookUseCase;

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

    createBookUseCase = new CreateBookUseCase(bookRepository);
  });

  it('Should create and save a new book successfully', async () => {
    const dto: CreateBookDto = {
      isbn: '978-0-13-468599-1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publicationYear: 2008,
      category: 'Software Engineering',
      availableCopies: 3,
      totalCopies: 5,
    };

    const mockBook = new Book(
      'mocked-uuid',
      ISBN.create(dto.isbn),
      dto.title,
      dto.author,
      dto.publicationYear,
      dto.category,
      dto.availableCopies,
      dto.totalCopies,
    );

    bookRepository.save.mockResolvedValue(mockBook);

    const result = await createBookUseCase.execute(dto);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Book);
    expect(result.id).toBe('mocked-uuid');
    expect(result.title).toBe(dto.title);
    expect(bookRepository.save).toHaveBeenCalledTimes(1);
    expect(bookRepository.save).toHaveBeenCalledWith(expect.any(Book));
  });

  it('Should throw if repository.save fails', async () => {
    const dto: CreateBookDto = {
      isbn: '978-0-13-468599-1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publicationYear: 2008,
      category: 'Software Engineering',
      availableCopies: 3,
      totalCopies: 5,
    };

    bookRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(createBookUseCase.execute(dto)).rejects.toThrow('Database error');
  });
});
