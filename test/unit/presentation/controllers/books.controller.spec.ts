import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../../../../src/presentation/controllers/books.controller';
import { CheckBookAvailabilityUseCase } from '../../../../src/application/use-cases/CheckBookAvailabilityUseCase';
import { GetAllBooksUseCase } from '../../../../src/application/use-cases/books/GetAllBooksUseCase';
import { UpdateBookByIdUseCase } from '../../../../src/application/use-cases/books/UpdateBookByIdUseCase';
import { CreateBookUseCase } from '../../../../src/application/use-cases/books/CreateBookUseCase';
import { FindBookByIdUseCase } from '../../../../src/application/use-cases/books/FindBookByIdUseCase';
import { FindBookByISBNUseCase } from '../../../../src/application/use-cases/books/FindBookByISBNUseCase';
import { DeleteBookByIdUseCase } from '../../../../src/application/use-cases/books/DeleteBookByIdUseCase';
import { BookNotFoundException } from '../../../../src/domain/exceptions/books/BookNotFoundException';
import { HttpException } from '@nestjs/common';
import { CreateBookDto } from '../../../../src/application/dtos/CreateBookDto';
import { UpdateBookDto } from '../../../../src/application/dtos/UpdateBookDto';

describe('BooksController', () => {
  let controller: BooksController;

  let mockCheckBookAvailabilityUseCase: Partial<CheckBookAvailabilityUseCase>;
  let mockGetAllBooksUseCase: Partial<GetAllBooksUseCase>;
  let mockUpdateBookByIDUseCase: Partial<UpdateBookByIdUseCase>;
  let mockCreateBookUseCase: Partial<CreateBookUseCase>;
  let mockFindBookByIdUseCase: Partial<FindBookByIdUseCase>;
  let mockFindBookByIsbnUseCase: Partial<FindBookByISBNUseCase>;
  let mockDeleteBookByIdUseCase: Partial<DeleteBookByIdUseCase>;

  const dummyBook = {
    id: 'a1b2c3d4',
    isbn: '978-3-16-148410-0',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publicationYear: 2008,
    category: 'Software Engineering',
    availableCopies: 5,
    totalCopies: 10,
  };

  beforeEach(async () => {
    mockCheckBookAvailabilityUseCase = { execute: jest.fn() };
    mockGetAllBooksUseCase = { execute: jest.fn() };
    mockUpdateBookByIDUseCase = { execute: jest.fn() };
    mockCreateBookUseCase = { execute: jest.fn() };
    mockFindBookByIdUseCase = { execute: jest.fn() };
    mockFindBookByIsbnUseCase = { execute: jest.fn() };
    mockDeleteBookByIdUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: CheckBookAvailabilityUseCase, useValue: mockCheckBookAvailabilityUseCase },
        { provide: GetAllBooksUseCase, useValue: mockGetAllBooksUseCase },
        { provide: UpdateBookByIdUseCase, useValue: mockUpdateBookByIDUseCase },
        { provide: CreateBookUseCase, useValue: mockCreateBookUseCase },
        { provide: FindBookByIdUseCase, useValue: mockFindBookByIdUseCase },
        { provide: FindBookByISBNUseCase, useValue: mockFindBookByIsbnUseCase },
        { provide: DeleteBookByIdUseCase, useValue: mockDeleteBookByIdUseCase },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  describe('getAllBooks', () => {
    it('should return all books', async () => {
      (mockGetAllBooksUseCase.execute as jest.Mock).mockResolvedValue([dummyBook]);
      const result = await controller.getAllBooks();
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Books have been found correctly',
        data: [dummyBook],
      });
    });

    it('should throw HttpException on error', async () => {
      (mockGetAllBooksUseCase.execute as jest.Mock).mockRejectedValue(new Error());
      await expect(controller.getAllBooks()).rejects.toThrow(HttpException);
    });
  });

  describe('checkAvailability', () => {
    it('should return availability for a book', async () => {
      const availability = { ...dummyBook, isAvailable: true };
      (mockCheckBookAvailabilityUseCase.execute as jest.Mock).mockResolvedValue(availability);
      const result = await controller.checkAvailability('a1b2c3d4');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Availability book has been found correctly',
        data: availability,
      });
    });

    it('should throw 404 if book not found', async () => {
      (mockCheckBookAvailabilityUseCase.execute as jest.Mock).mockRejectedValue(
        new BookNotFoundException(),
      );
      await expect(controller.checkAvailability('missing')).rejects.toThrow(HttpException);
    });
  });

  describe('getBookById', () => {
    it('should return book by ID', async () => {
      (mockFindBookByIdUseCase.execute as jest.Mock).mockResolvedValue(dummyBook);
      const result = await controller.getBookById('a1b2c3d4');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Book by id has been found correctly',
        data: dummyBook,
      });
    });

    it('should throw 404 if book not found', async () => {
      (mockFindBookByIdUseCase.execute as jest.Mock).mockRejectedValue(new BookNotFoundException());
      await expect(controller.getBookById('missing')).rejects.toThrow(HttpException);
    });
  });

  describe('getBookByIsbn', () => {
    it('should return book by ISBN', async () => {
      (mockFindBookByIsbnUseCase.execute as jest.Mock).mockResolvedValue(dummyBook);
      const result = await controller.getBookByIsbn('978-3-16-148410-0');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Book by isbn has been found correctly',
        data: dummyBook,
      });
    });

    it('should throw 404 if book not found', async () => {
      (mockFindBookByIsbnUseCase.execute as jest.Mock).mockRejectedValue(
        new BookNotFoundException(),
      );
      await expect(controller.getBookByIsbn('978-0-00-000000-0')).rejects.toThrow(HttpException);
    });
  });

  describe('createBook', () => {
    const createBookDto: CreateBookDto = {
      isbn: '978-3-16-148410-0',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      publicationYear: 2017,
      category: 'Software Engineering',
      availableCopies: 10,
      totalCopies: 10,
    };

    it('should create a book', async () => {
      (mockCreateBookUseCase.execute as jest.Mock).mockResolvedValue(dummyBook);
      const result = await controller.createBook(createBookDto);
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been created correctly',
        data: dummyBook,
      });
    });

    it('should throw HttpException on error', async () => {
      (mockCreateBookUseCase.execute as jest.Mock).mockRejectedValue(new Error());
      await expect(controller.createBook(createBookDto)).rejects.toThrow(HttpException);
    });
  });

  describe('updateBookById', () => {
    const updateBookDto: UpdateBookDto = {
      title: 'Clean Code Updated',
      author: 'Robert C. Martin',
      publicationYear: 2024,
      category: 'Software Engineering',
      availableCopies: 7,
      totalCopies: 10,
    };

    it('should update a book', async () => {
      (mockUpdateBookByIDUseCase.execute as jest.Mock).mockResolvedValue(dummyBook);
      const result = await controller.updateBookById('a1b2c3d4', updateBookDto);
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been updated correctly',
        data: dummyBook,
      });
    });

    it('should throw 404 if book not found', async () => {
      (mockUpdateBookByIDUseCase.execute as jest.Mock).mockRejectedValue(
        new BookNotFoundException(),
      );
      await expect(controller.updateBookById('missing', updateBookDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteBookById', () => {
    it('should delete a book', async () => {
      (mockDeleteBookByIdUseCase.execute as jest.Mock).mockResolvedValue(undefined);
      const result = await controller.deleteBookById('a1b2c3d4');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been deleted correctly',
      });
    });

    it('should throw 404 if book not found', async () => {
      (mockDeleteBookByIdUseCase.execute as jest.Mock).mockRejectedValue(
        new BookNotFoundException(),
      );
      await expect(controller.deleteBookById('missing')).rejects.toThrow(HttpException);
    });
  });
});
