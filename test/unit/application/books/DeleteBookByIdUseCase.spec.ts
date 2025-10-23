import { DeleteBookByIdUseCase } from '../../../../src/application/use-cases/books/DeleteBookByIdUseCase';
import { BookNotFoundException } from '../../../../src/domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../../../src/domain/interfaces/IBookRepository';

describe('DeleteBookByIdUseCase', () => {
  let deleteBookByIdUseCase: DeleteBookByIdUseCase;

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

    deleteBookByIdUseCase = new DeleteBookByIdUseCase(bookRepository);
  });

  it('Should call repository.delete with correct ID', async () => {
    const bookId = 'test-book-id';

    bookRepository.delete.mockResolvedValue(undefined);

    await deleteBookByIdUseCase.execute(bookId);

    expect(bookRepository.delete).toHaveBeenCalledTimes(1);
    expect(bookRepository.delete).toHaveBeenCalledWith(bookId);
  });

  it('Should throw if repository.delete fails', async () => {
    const bookId = 'test-book-id';
    bookRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(deleteBookByIdUseCase.execute(bookId)).rejects.toThrow('Database error');
  });

  it('Should handle deletion of non-existent book gracefully', async () => {
    const bookId = 'non-existent-id';
    bookRepository.delete.mockRejectedValue(new BookNotFoundException());

    await expect(deleteBookByIdUseCase.execute(bookId)).rejects.toThrow(BookNotFoundException);

    expect(bookRepository.delete).toHaveBeenCalledWith(bookId);
  });
});
