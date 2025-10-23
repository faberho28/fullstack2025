import { UpdateBookDto } from '../../../../src/application/dtos/UpdateBookDto';
import { UpdateBookByIdUseCase } from '../../../../src/application/use-cases/books/UpdateBookByIdUseCase';
import { Book } from '../../../../src/domain/entities/Book.entity';
import { BookNotFoundException } from '../../../../src/domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../../../src/domain/interfaces/IBookRepository';
import { ISBN } from '../../../../src/domain/value-objects/ISBN.vo';

describe('CheckBookAvailabilityUseCase', () => {
  let updateBookByIDUseCase: UpdateBookByIdUseCase;

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

    updateBookByIDUseCase = new UpdateBookByIdUseCase(bookRepository);
  });

  it('Should update a book successfully', async () => {
    const bookId = 'book-123';
    const currentBook = new Book(
      bookId,
      ISBN.create('978-0-13-468599-1'),
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      3,
      5,
    );

    const updateDto: UpdateBookDto = {
      title: 'Clean Code - Updated',
      availableCopies: 4,
    };

    bookRepository.findById.mockResolvedValue(currentBook);

    const updatedBook = currentBook.update(updateDto);
    bookRepository.update.mockResolvedValue(updatedBook);

    const spyUpdate = jest.spyOn(currentBook, 'update');

    const result = await updateBookByIDUseCase.execute(bookId, updateDto);

    expect(spyUpdate).toHaveBeenCalledWith(updateDto);
    expect(bookRepository.update).toHaveBeenCalledWith(result);
    expect(result.title).toBe('Clean Code - Updated');
    expect(result.getAvailableCopies()).toBe(4);
  });

  it('Should throw BookNotFoundException if book does not exist', async () => {
    const bookId = 'non-existent-book';
    const updateDto: UpdateBookDto = { title: 'New Title' };

    bookRepository.findById.mockResolvedValue(null);

    await expect(updateBookByIDUseCase.execute(bookId, updateDto)).rejects.toThrow(
      BookNotFoundException,
    );
  });

  it('Should propagate unexpected repository errors', async () => {
    const bookId = 'book-123';
    const currentBook = new Book(
      bookId,
      ISBN.create('978-0-13-468599-1'),
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software Engineering',
      3,
      5,
    );

    const updateDto: UpdateBookDto = { title: 'Updated Title' };

    bookRepository.findById.mockResolvedValue(currentBook);
    bookRepository.update.mockRejectedValue(new Error('Database error'));

    await expect(updateBookByIDUseCase.execute(bookId, updateDto)).rejects.toThrow(
      'Database error',
    );
  });
});
